import { inject, injectable } from 'tsyringe';
import BigNumber from 'bignumber.js';
import IUsersBalancesRepository from '../repositories/IUsersBalancesRepository';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';
import ITransfersRepository from '../repositories/ITransfersRepository';

import ICreateTransferDTO from '../dtos/ICreateTransferDTO';

@injectable()
class CreateTransfersFromIncomeToAvailableService {
  constructor(
    @inject('UsersBalancesRepository')
    private usersBalancesRepository: IUsersBalancesRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,

    @inject('UserPlansGainsQueue')
    private userPlansGainsQueue: IQueue,
  ) {}

  public async execute(): Promise<void> {
    const incomeBalances = await this.usersBalancesRepository.findAllByCard(
      'income',
    );

    const incomeBalancesGreaterThanZero = incomeBalances.filter(b =>
      new BigNumber(b.usd_cents).isGreaterThan(0),
    );

    const profits: ICreateTransferDTO[] = incomeBalancesGreaterThanZero.map(
      income => {
        return {
          card: 'available',
          description: 'Transfer from income',
          usd_cents: income.usd_cents,
          user_id: income.user_id,
        } as ICreateTransferDTO;
      },
    );
    await Promise.all(
      profits.map(profit =>
        this.transfersRepository.create({
          card: 'income',
          description: 'Transfer to available',
          usd_cents: new BigNumber(profit.usd_cents)
            .multipliedBy(-1)
            .toNumber(),
          user_id: profit.user_id,
        }),
      ),
    );
    await Promise.all(
      profits.map(profit => this.userPlansGainsQueue.add(profit)),
    );
  }
}
export default CreateTransfersFromIncomeToAvailableService;
