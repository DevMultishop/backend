import { inject, injectable } from 'tsyringe';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';

@injectable()
class EnqueueBitcoinBlockNotificationService {
  constructor(
    @inject('BitcoinBlockNotificationsQueue')
    private bitcoinBlockNotificationsQueue: IQueue,
  ) {}

  public async execute(block_hash: string): Promise<string> {
    return this.bitcoinBlockNotificationsQueue.add({ block_hash });
  }
}
export default EnqueueBitcoinBlockNotificationService;
