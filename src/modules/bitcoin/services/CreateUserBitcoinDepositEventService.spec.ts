import FakeUsersBitcoinDepositsEventsRepository from '../repositories/fakes/FakeUsersBitcoinDepositsEventsRepository';
import FakeBitcoin from '../../../shared/container/providers/CryptoProvider/fakes/FakeBitcoin';
import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserDepositEventService from './CreateUserDepositEventService';

let fakeUsersBitcoinDepositsEventsRepository: FakeUsersBitcoinDepositsEventsRepository;
let fakeBitcoin: FakeBitcoin;
let fakeCacheProvider: FakeCacheProvider;
let createUserDepositEventService: CreateUserDepositEventService;

describe('CreateUserBitcoinDepositEventService tests', () => {
  beforeEach(() => {
    fakeUsersBitcoinDepositsEventsRepository =
      new FakeUsersBitcoinDepositsEventsRepository();

    fakeBitcoin = new FakeBitcoin();
    fakeCacheProvider = new FakeCacheProvider();

    createUserDepositEventService = new CreateUserDepositEventService(
      fakeUsersBitcoinDepositsEventsRepository,
      fakeBitcoin,
      fakeCacheProvider,
    );
  });
  it('should return a correct user bitcoin deposit event', async () => {
    const event = await createUserDepositEventService.execute('user_id', 1);
    expect(event).toHaveProperty('address');
    expect(event).toHaveProperty('btc_usd_conversion', 50000);
    expect(event).toHaveProperty('usd_cents', 100);
    expect(event).toHaveProperty('satoshis', 2000);
    expect(event.formatted_usd_value).toBe('$1.00');
    expect(event.formatted_btc_amount).toBe('0.00002');
  });
});
