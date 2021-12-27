import FakeQueue from '../../../shared/container/providers/QueueProvider/fakes/FakeQueue';
import EnqueueBitcoinBlockNotificationService from './EnqueueBitcoinBlockNotificationService';

let fakeQueue: FakeQueue;
let enqueueBitcoinBlockNotificationService: EnqueueBitcoinBlockNotificationService;

describe('EnqueueBitcoinBlockNotificationService tests', () => {
  beforeEach(() => {
    fakeQueue = new FakeQueue();
    enqueueBitcoinBlockNotificationService =
      new EnqueueBitcoinBlockNotificationService(fakeQueue);
  });
  it('should return done', async () => {
    await expect(
      enqueueBitcoinBlockNotificationService.execute('block_hash'),
    ).resolves.toBe('done');
  });
});
