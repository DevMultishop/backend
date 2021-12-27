import FakeBitcoinDepositsEventsRepository from '../repositories/fakes/FakeBitcoinDepositsEventsRepository';
import FakeBitcoin from '../../../shared/container/providers/CryptoProvider/fakes/FakeBitcoin';
import CheckPendingBitcoinDepositsService from './CheckPendingBitcoinDepositsService';

let fakeBitcoinDepositsEventsRepository: FakeBitcoinDepositsEventsRepository;
let fakeBitcoin: FakeBitcoin;
let checkPendingBitcoinDepositsService: CheckPendingBitcoinDepositsService;

describe('CheckPendingBitcoinDepositsService tests', () => {
  beforeEach(() => {
    fakeBitcoinDepositsEventsRepository =
      new FakeBitcoinDepositsEventsRepository();

    fakeBitcoin = new FakeBitcoin();

    checkPendingBitcoinDepositsService = new CheckPendingBitcoinDepositsService(
      fakeBitcoinDepositsEventsRepository,
      fakeBitcoin,
    );
  });
  it('should return an empty array', async () => {
    await expect(
      checkPendingBitcoinDepositsService.execute(),
    ).resolves.toHaveLength(0);
  });
  it('should return an array with 1 new confirmed deposit', async () => {
    const deposit = await fakeBitcoinDepositsEventsRepository.create({
      address: 'address2',
      btc_usd_conversion: 10,
      satoshis: 10,
      status: 'pending',
      txid: 'txid_confirmed',
      usd_cents: 10,
    });
    const result = await checkPendingBitcoinDepositsService.execute();
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('status', 'confirmed');
    expect(result[0]).toHaveProperty('id', deposit.id);
  });
  it('should return an empty array', async () => {
    await fakeBitcoinDepositsEventsRepository.create({
      address: 'address2',
      btc_usd_conversion: 10,
      satoshis: 10,
      status: 'pending',
      txid: 'txid_unconfirmed',
      usd_cents: 10,
    });
    await expect(
      checkPendingBitcoinDepositsService.execute(),
    ).resolves.toHaveLength(0);
  });
});
