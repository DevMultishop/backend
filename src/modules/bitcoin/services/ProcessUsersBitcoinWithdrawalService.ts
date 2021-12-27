import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';
import ICryptoProvider from '../../../shared/container/providers/CryptoProvider/models/ICryptoProvider';

interface IMap {
  amounts: {
    [key: string]: string;
  };
  subtractFeeFrom: string[];
}

@injectable()
class ProcessUsersBitcoinWithdrawalService {
  constructor(
    @inject('UsersBitcoinWithdrawalsRepository')
    private usersBitcoinWithdrawalsRepository: IUsersBitcoinWithdrawalsRepository,

    @inject('Bitcoin')
    private bitcoin: ICryptoProvider,
  ) {}

  public async execute(ids: string[]): Promise<string> {
    const bitcoinWithdrawals =
      await this.usersBitcoinWithdrawalsRepository.findPendingByIds(ids);

    const mapped: IMap = bitcoinWithdrawals.reduce(
      (acc, curr) => {
        if (!acc.amounts[curr.address]) acc.amounts[curr.address] = '0';
        acc.amounts[curr.address] = new BigNumber(acc.amounts[curr.address])
          .plus(curr.formatted_btc_amount)
          .toFixed(8);

        if (!acc.subtractFeeFrom.find(addr => addr === curr.address))
          acc.subtractFeeFrom.push(curr.address);
        return acc;
      },
      {
        amounts: {},
        subtractFeeFrom: [],
      } as IMap,
    );

    try {
      const txid = await this.bitcoin.sendMany({ ...mapped });
      await Promise.all(
        bitcoinWithdrawals.map(async withdrawal => {
          const w = withdrawal;
          w.txid = txid;
          await this.usersBitcoinWithdrawalsRepository.save(w);
        }),
      );
    } catch (err) {
      throw new Error(err);
    }

    return 'sucess';
  }
}
export default ProcessUsersBitcoinWithdrawalService;
