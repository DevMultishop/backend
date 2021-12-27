import { inject, injectable } from 'tsyringe';
import BigNumber from 'bignumber.js';
import IUsersBalancesRepository from '../repositories/IUsersBalancesRepository';
import ITransfersRepository from '../repositories/ITransfersRepository';
import Transfer from '../infra/typeorm/entities/Transfer';

interface IParams {
  user_id: string;
  description: string;
  usd_cents: number;
  card: 'credit' | 'available' | 'income' | 'applied';
}

@injectable()
class CreateBalanceTransferService {
  constructor(
    @inject('UsersBalancesRepository')
    private usersBalancesRepository: IUsersBalancesRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,
  ) {}

  public async execute({
    card,
    user_id,
    usd_cents,
    description,
  }: IParams): Promise<Transfer> {
    let userBalance = await this.usersBalancesRepository.findByUserIdAndCard({
      user_id,
      card,
    });
    if (!userBalance)
      userBalance = await this.usersBalancesRepository.create({
        card,
        user_id,
      });

    const newBalance = new BigNumber(userBalance.usd_cents).plus(usd_cents);

    if (newBalance.isLessThan(0))
      throw new Error('Balance can not be negative');

    userBalance.usd_cents = Math.round(newBalance.toNumber());
    await this.usersBalancesRepository.save(userBalance);

    return this.transfersRepository.create({
      card,
      description,
      usd_cents,
      user_id,
    });
  }
}
export default CreateBalanceTransferService;
