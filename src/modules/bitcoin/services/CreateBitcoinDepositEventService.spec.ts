import FakeBitcoinDepositsEventsRepository from '../repositories/fakes/FakeBitcoinDepositsEventsRepository';
import FakeBitcoin from '../../../shared/container/providers/CryptoProvider/fakes/FakeBitcoin';
import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateBitcoinDepositEventService from './CreateBitcoinDepositEventService';

let fakeBitcoinDepositsEventsRepository: FakeBitcoinDepositsEventsRepository;
let fakeBitcoin: FakeBitcoin;
let fakeCacheProvider: FakeCacheProvider;
let createBitcoinDepositEventService: CreateBitcoinDepositEventService;

describe('CreateBitcoinDepositEventService tests', () => {
  beforeEach(() => {
    fakeBitcoinDepositsEventsRepository =
      new FakeBitcoinDepositsEventsRepository();

    fakeBitcoin = new FakeBitcoin();
    fakeCacheProvider = new FakeCacheProvider();

    createBitcoinDepositEventService = new CreateBitcoinDepositEventService(
      fakeBitcoinDepositsEventsRepository,
      fakeBitcoin,
      fakeCacheProvider,
    );
  });
  it('should return an empty array', async () => {
    await expect(
      createBitcoinDepositEventService.execute({ txid: 'test' }),
    ).resolves.toHaveLength(0);
  });
  it('should return an array with one new deposit created', async () => {
    const depositsEvents = await createBitcoinDepositEventService.execute({
      txid: 'txid_to_create',
    });
    expect(depositsEvents).toHaveLength(1);
    expect(depositsEvents[0]).toHaveProperty('id');
    expect(depositsEvents[0]).toHaveProperty('satoshis', 100000000);
    expect(depositsEvents[0]).toHaveProperty('status', 'pending');
    expect(depositsEvents[0]).toHaveProperty('address', 'address_to_create');
    expect(depositsEvents[0]).toHaveProperty('txid', 'txid_to_create');
    expect(depositsEvents[0]).toHaveProperty('btc_usd_conversion', 50000);
    expect(depositsEvents[0]).toHaveProperty('usd_cents', 5000000);
  });
  it('should return an array with one deposit previosly created', async () => {
    const event = await fakeBitcoinDepositsEventsRepository.create({
      address: 'address_to_create',
      btc_usd_conversion: 10000,
      satoshis: 5000,
      status: 'pending',
      txid: 'txid_to_create',
      usd_cents: 50,
    });
    const depositsEvents = await createBitcoinDepositEventService.execute({
      txid: 'txid_to_create',
    });
    expect(depositsEvents).toHaveLength(1);
    expect(depositsEvents[0]).toHaveProperty('id', event.id);
    expect(depositsEvents[0]).toHaveProperty('satoshis', 5000);
    expect(depositsEvents[0]).toHaveProperty('status', 'pending');
    expect(depositsEvents[0]).toHaveProperty('address', 'address_to_create');
    expect(depositsEvents[0]).toHaveProperty('txid', 'txid_to_create');
    expect(depositsEvents[0]).toHaveProperty('btc_usd_conversion', 10000);
    expect(depositsEvents[0]).toHaveProperty('usd_cents', 50);
  });
});
