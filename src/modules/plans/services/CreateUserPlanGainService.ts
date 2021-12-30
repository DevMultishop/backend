import { inject, injectable } from 'tsyringe';
import BigNumber from 'bignumber.js';
import IUsersPlansRepository from '../repositories/IUsersPlansRepository';
import Transfer from '../../balances/infra/typeorm/entities/Transfer';
import ICreateTransferDTO from '../../balances/dtos/ICreateTransferDTO';
import IUsersBalancesRepository from '../../balances/repositories/IUsersBalancesRepository';
import ITransfersRepository from '../../balances/repositories/ITransfersRepository';

@injectable()
class CreateUserPlanGainService {
  constructor(
    @inject('UsersPlansRepository')
    private usersPlansRepository: IUsersPlansRepository,

    @inject('UsersBalancesRepository')
    private usersBalancesRepository: IUsersBalancesRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,
  ) {}

  public async execute(gain: ICreateTransferDTO): Promise<Transfer[]> {
    const result: Transfer[] = [];

    const activePlans = await this.usersPlansRepository.findNotFilledByUserId(
      gain.user_id,
    );

    if (activePlans.length === 0) return result;

    const serializedPayments = async (
      value: number,
      index: number,
    ): Promise<string> => {
      if (index === activePlans.length) return 'done';
      const current = activePlans[index];
      if (current.filled_at) return serializedPayments(value, index + 1);

      const capacity = new BigNumber(current.limit_usd_cents)
        .minus(current.progress_usd_cents)
        .toNumber();
      const surpluValue = new BigNumber(value).minus(capacity);

      const transferValue = surpluValue.isGreaterThan(0) ? capacity : value;

      let userBalance = await this.usersBalancesRepository.findByUserIdAndCard({
        user_id: gain.user_id,
        card: 'available',
      });
      if (!userBalance)
        userBalance = await this.usersBalancesRepository.create({
          card: 'available',
          user_id: gain.user_id,
        });

      const newBalance = new BigNumber(userBalance.usd_cents).plus(
        transferValue,
      );
      userBalance.usd_cents = Math.round(newBalance.toNumber());
      await this.usersBalancesRepository.save(userBalance);

      result.push(
        await this.transfersRepository.create({
          card: gain.card,
          description: gain.description,
          usd_cents: transferValue,
          user_id: gain.user_id,
        }),
      );

      current.progress_usd_cents = Math.round(
        new BigNumber(current.progress_usd_cents)
          .plus(transferValue)
          .toNumber(),
      );
      await this.usersPlansRepository.save(current);
      if (
        new BigNumber(current.progress_usd_cents).isGreaterThanOrEqualTo(
          current.limit_usd_cents,
        )
      ) {
        current.filled_at = new Date();
        await this.usersPlansRepository.save(current);

        return serializedPayments(surpluValue.toNumber(), index + 1);
      }

      return 'done';
    };

    await serializedPayments(Number(gain.usd_cents), 0);

    return result;
  }
}
export default CreateUserPlanGainService;
