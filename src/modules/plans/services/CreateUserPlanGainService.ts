import { inject, injectable } from 'tsyringe';
import BigNumber from 'bignumber.js';
import { endOfDay, startOfDay } from 'date-fns';
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

    const today = new Date();
    const todayGains = await this.transfersRepository.findAllByPeriod(
      gain.user_id,
      startOfDay(today),
      endOfDay(today),
      'available',
    );
    const today_gain = todayGains.reduce(
      (acc, curr) =>
        Number(curr.usd_cents) > 0
          ? new BigNumber(acc).plus(curr.usd_cents).toNumber()
          : acc,
      0,
    );

    const max_plan_cents_value = Math.max(
      ...activePlans.map(p => Number(p.plan.usd_cents)),
      0,
    );

    const max_daily = max_plan_cents_value * 0.5; // limite diario de 50% do valor do plano

    const daily_capacity = new BigNumber(max_daily)
      .minus(today_gain)
      .toNumber();

    const value = Math.min(Number(gain.usd_cents), daily_capacity);

    if (value > 0) await serializedPayments(value, 0);

    return result;
  }
}
export default CreateUserPlanGainService;
