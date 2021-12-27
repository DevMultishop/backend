import { v4 } from 'uuid';
import ICryptoProvider from '../models/ICryptoProvider';
import IGetCoinParValueDTO from '../dtos/IGetCoinParValueDTO';

class FakeBitcoin implements ICryptoProvider {
  private transactions: BitcoinCore.Transaction[] = [
    {
      txid: 'txid_confirmed',
      amount: 1,
      confirmations: 3,
      blockindex: 1,
      blocktime: 123,
      fee: 0,
      hex: 'hex',
      time: 123,
      timereceived: 123,
      details: [
        {
          abandoned: false,
          address: 'address1',
          amount: 1,
          category: 'receive',
          fee: 0,
          label: 'label',
          vout: 1,
        },
      ],
    },
    {
      txid: 'txid_unconfirmed',
      amount: 1,
      confirmations: 1,
      blockindex: 1,
      blocktime: 123,
      fee: 0,
      hex: 'hex',
      time: 123,
      timereceived: 123,
      details: [
        {
          abandoned: false,
          address: 'address2',
          amount: 1,
          category: 'receive',
          fee: 0,
          label: 'label',
          vout: 1,
        },
      ],
    },
    {
      txid: 'txid_to_create',
      amount: 1,
      confirmations: 1,
      blockindex: 1,
      blocktime: 123,
      fee: 0,
      hex: 'hex',
      time: 123,
      timereceived: 123,
      details: [
        {
          abandoned: false,
          address: 'address_to_create',
          amount: 1,
          category: 'receive',
          fee: 0,
          label: 'label',
          vout: 1,
        },
      ],
    },
  ];

  public async getCoinsPrice({ from }: IGetCoinParValueDTO): Promise<number> {
    if (from === 'USD') return 1 / 50000;
    return 50000;
  }

  public async createNewAddress(): Promise<string> {
    return v4();
  }

  public async getTransactionByTxid(
    txid: string,
  ): Promise<BitcoinCore.Transaction | undefined> {
    return this.transactions.find(t => t.txid === txid);
  }

  public async checkValidAddress(): Promise<boolean> {
    return true;
  }

  public async sendMany(): Promise<string> {
    return 'txid';
  }
}
export default FakeBitcoin;
