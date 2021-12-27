import { container } from 'tsyringe';
import { Arg, Mutation, Resolver } from 'type-graphql';
import EnqueueBitcoinTxidNotificationService from '../../../services/EnqueueBitcoinTxidNotificationService';
import EnqueueBitcoinBlockNotificationService from '../../../services/EnqueueBitcoinBlockNotificationService';

@Resolver()
class NotificationResolver {
  @Mutation(() => String)
  async createTxidNotification(@Arg('txid') txid: string): Promise<string> {
    const enqueueBitcoinTxidNotificationService = container.resolve(
      EnqueueBitcoinTxidNotificationService,
    );

    await enqueueBitcoinTxidNotificationService.execute(txid);
    return txid;
  }

  @Mutation(() => String)
  async createBlockNotification(
    @Arg('block_hash') block_hash: string,
  ): Promise<string> {
    const enqueueBitcoinBlockNotificationService = container.resolve(
      EnqueueBitcoinBlockNotificationService,
    );

    await enqueueBitcoinBlockNotificationService.execute(block_hash);
    return block_hash;
  }
}

export default NotificationResolver;
