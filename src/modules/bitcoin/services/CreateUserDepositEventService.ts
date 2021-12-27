import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
import ICryptoProvider from '../../../shared/container/providers/CryptoProvider/models/ICryptoProvider';
import UserBitcoinDepositEvent from '../infra/typeorm/entities/UserBitcoinDepositEvent';
import IUsersBitcoinDepositsEventsRepository from '../repositories/IUsersBitcoinDepositsEventsRepository';

@injectable()
class CreateUserBitcoinDepositEventService {
  constructor(
    @inject('UsersBitcoinDepositsEventsRepository')
    private usersBitcoinDepositsEventsRepository: IUsersBitcoinDepositsEventsRepository,

    @inject('Bitcoin')
    private bitcoin: ICryptoProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(
    user_id: string,
    usd_value: number,
  ): Promise<UserBitcoinDepositEvent> {
    const key = `coin-pair-conversion:BTC/USD`;
    let btc_usd_conversion = await this.cacheProvider.recover<number>(key);
    if (!btc_usd_conversion) {
      btc_usd_conversion = await this.bitcoin.getCoinsPrice({
        from: 'BTC',
        to: 'USD',
      });
      await this.cacheProvider.save(key, btc_usd_conversion, 5);
    }

    const address = await this.bitcoin.createNewAddress();

    const satoshis = new BigNumber(1 / btc_usd_conversion)
      .multipliedBy(usd_value)
      .multipliedBy(100 * 1000 * 1000)
      .toNumber();

    const event = await this.usersBitcoinDepositsEventsRepository.create({
      address,
      satoshis,
      usd_cents: usd_value * 100,
      user_id,
      btc_usd_conversion,
    });

    return event;
  }
}
export default CreateUserBitcoinDepositEventService;
