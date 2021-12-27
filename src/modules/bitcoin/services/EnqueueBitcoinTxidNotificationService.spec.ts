import FakeQueue from '../../../shared/container/providers/QueueProvider/fakes/FakeQueue';
import EnqueueBitcoinTxidNotificationService from './EnqueueBitcoinTxidNotificationService';

let fakeQueue: FakeQueue;
let enqueueBitcoinTxidNotificationService: EnqueueBitcoinTxidNotificationService;

describe('EnqueueBitcoinTxidNotificationService tests', () => {
  beforeEach(() => {
    fakeQueue = new FakeQueue();

    enqueueBitcoinTxidNotificationService =
      new EnqueueBitcoinTxidNotificationService(fakeQueue);
  });
  it('should return done', async () => {
    await expect(
      enqueueBitcoinTxidNotificationService.execute('txid'),
    ).resolves.toBe('done');
  });
});
