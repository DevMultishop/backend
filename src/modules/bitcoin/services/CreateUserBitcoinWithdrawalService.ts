import { injectable, inject } from 'tsyringe';
import BigNumber from 'bignumber.js';
import Transfer from '../../balances/infra/typeorm/entities/Transfer';
import IUsersBitcoinWalletsRepository from '../../users/repositories/IUsersBitcoinWalletsRepository';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';
import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
import ICryptoProvider from '../../../shared/container/providers/CryptoProvider/models/ICryptoProvider';
import UserBitcoinWithdrawal from '../infra/typeorm/entities/UserBitcoinWithdrawal';

interface IParams {
  user_id: string;
  usd_value: number;
}

@injectable()
class CreateUserBitcoinWithdrawalService {
  constructor(
    @inject('BalanceTransferQueue')
    private balanceTransferQueue: IQueue,

    @inject('UsersBitcoinWithdrawalsRepository')
    private usersBitcoinWithdrawalsRepository: IUsersBitcoinWithdrawalsRepository,

    @inject('UsersBitcoinWalletsRepository')
    private usersBitcoinWalletsRepository: IUsersBitcoinWalletsRepository,

    @inject('Bitcoin')
    private bitcoin: ICryptoProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    usd_value,
  }: IParams): Promise<UserBitcoinWithdrawal> {
    const userWallet = await this.usersBitcoinWalletsRepository.findByUserId(
      user_id,
    );
    if (!userWallet) throw new Error('User bitcoin address not found');

    const usd_cents = Math.round(
      new BigNumber(usd_value).multipliedBy(100).toNumber(),
    );

    const availableWithdrawal = await this.balanceTransferQueue.add<
      Transfer | undefined
    >({
      user_id,
      usd_cents: usd_cents * -1,
      description: `Bitcoin withdrawal`,
      card: 'available',
    });

    if (!availableWithdrawal)
      throw new Error('Something went wrong, check your available balance');

    const key = `coin-pair-conversion:BTC/USD`;
    let btc_usd_conversion = await this.cacheProvider.recover<number>(key);
    if (!btc_usd_conversion) {
      btc_usd_conversion = await this.bitcoin.getCoinsPrice({
        from: 'BTC',
        to: 'USD',
      });
      await this.cacheProvider.save(key, btc_usd_conversion, 5);
    }

    const satoshis = new BigNumber(1 / btc_usd_conversion)
      .multipliedBy(usd_value)
      .multipliedBy(100 * 1000 * 1000)
      .toNumber();

    const bitcoinWithdrawal =
      await this.usersBitcoinWithdrawalsRepository.create({
        address: userWallet.address,
        btc_usd_conversion,
        satoshis,
        usd_cents,
        user_id,
      });

    return bitcoinWithdrawal;
  }
}
export default CreateUserBitcoinWithdrawalService;
