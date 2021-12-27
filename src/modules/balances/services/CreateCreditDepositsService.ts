import { inject, injectable } from 'tsyringe';
import { addMinutes, isBefore } from 'date-fns';
import IUsersBitcoinDepositsEventsRepository from '../../bitcoin/repositories/IUsersBitcoinDepositsEventsRepository';
import BitcoinDepositEvent from '../../bitcoin/infra/typeorm/entities/BitcoinDepositEvent';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';
import Transfer from '../infra/typeorm/entities/Transfer';

@injectable()
class CreateCreditDepositsService {
  constructor(
    @inject('BalanceTransferQueue')
    private balanceTransferQueue: IQueue,

    @inject('UsersBitcoinDepositsEventsRepository')
    private usersBitcoinDepositsEventsRepository: IUsersBitcoinDepositsEventsRepository,
  ) {}

  public async execute(
    bitcoinDeposits: BitcoinDepositEvent[],
  ): Promise<string> {
    await Promise.all(
      bitcoinDeposits.map(async deposit => {
        const userDeposit =
          await this.usersBitcoinDepositsEventsRepository.findByAddress(
            deposit.address,
          );
        if (userDeposit) {
          const amountok = deposit.satoshis === userDeposit.satoshis;
          const timeok = isBefore(
            deposit.created_at,
            addMinutes(userDeposit.created_at, 5),
          );
          const usd_cents =
            amountok && timeok ? userDeposit.usd_cents : deposit.usd_cents;

          await this.balanceTransferQueue.add<Transfer>({
            user_id: userDeposit.user_id,
            card: 'credit',
            usd_cents,
            description: 'Bitcoin deposit',
          });
        }
      }),
    );
    return 'done';
  }
}
export default CreateCreditDepositsService;
