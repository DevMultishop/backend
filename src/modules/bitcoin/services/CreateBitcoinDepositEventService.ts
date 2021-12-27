import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import { ITxidNotificationsParams } from '../../../shared/container/providers/QueueProvider/implementations/BitcoinTxidNotificationsQueue';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
import BitcoinDepositEvent from '../infra/typeorm/entities/BitcoinDepositEvent';
import IBitcoinDepositsEventsRepository from '../repositories/IBitcoinDepositsEventsRepository';
import ICryptoProvider from '../../../shared/container/providers/CryptoProvider/models/ICryptoProvider';

@injectable()
class CreateBitcoinDepositEventService {
  constructor(
    @inject('BitcoinDepositsEventsRepository')
    private bitcoinDepositsEventsRepository: IBitcoinDepositsEventsRepository,

    @inject('Bitcoin')
    private bitcoin: ICryptoProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    txid,
  }: ITxidNotificationsParams): Promise<BitcoinDepositEvent[]> {
    const transaction = await this.bitcoin.getTransactionByTxid(txid);

    if (!transaction) return [];

    const deposits = transaction
      ? transaction.details.filter(t => t.category === 'receive')
      : [];

    if (deposits.length === 0) return [];

    const alreadyExists = await this.bitcoinDepositsEventsRepository.findByTxid(
      txid,
    );

    if (alreadyExists.length > 0) return alreadyExists;

    const key = `coin-pair-conversion:BTC/USD`;
    let btc_usd_conversion = await this.cacheProvider.recover<number>(key);
    if (!btc_usd_conversion) {
      btc_usd_conversion = await this.bitcoin.getCoinsPrice({
        from: 'BTC',
        to: 'USD',
      });
      await this.cacheProvider.save(key, btc_usd_conversion, 5);
    }

    return Promise.all(
      deposits.map(newDeposit => {
        const satoshis = new BigNumber(newDeposit.amount)
          .times(100 * 1000 * 1000)
          .toNumber();
        const usd_cents = new BigNumber(newDeposit.amount)
          .multipliedBy(btc_usd_conversion || 0)
          .multipliedBy(100)
          .toNumber();
        return this.bitcoinDepositsEventsRepository.create({
          address: newDeposit.address,
          satoshis,
          status: 'pending',
          txid,
          btc_usd_conversion: btc_usd_conversion as number,
          usd_cents: Math.round(usd_cents),
        });
      }),
    );
  }
}
export default CreateBitcoinDepositEventService;
