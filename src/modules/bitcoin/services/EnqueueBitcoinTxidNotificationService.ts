import { inject, injectable } from 'tsyringe';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';

@injectable()
class EnqueueBitcoinTxidNotificationService {
  constructor(
    @inject('BitcoinTxidNotificationsQueue')
    private bitcoinTxidNotificationsQueue: IQueue,
  ) {}

  public async execute(txid: string): Promise<string> {
    return this.bitcoinTxidNotificationsQueue.add<string>({ txid });
  }
}
export default EnqueueBitcoinTxidNotificationService;
