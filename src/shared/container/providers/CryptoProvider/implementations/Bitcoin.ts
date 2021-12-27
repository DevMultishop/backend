import axios from 'axios';
import BitcoinServer, { Server } from 'bitcoin-core';
import WAVvalidator from 'multicoin-address-validator';
import ICryptoProvider from '../models/ICryptoProvider';
import bitcoinConfig from '../../../../../config/bitcoin';
import IGetCoinParValueDTO from '../dtos/IGetCoinParValueDTO';
import ISendManyDTO from '../dtos/ISendManyDTO';

class Bitcoin implements ICryptoProvider {
  private cryptocompareApikey: string | null;

  private client: Server;

  constructor() {
    const { connection } = bitcoinConfig;
    this.client = new BitcoinServer(connection);
  }

  public async getCoinsPrice({
    from,
    to,
  }: IGetCoinParValueDTO): Promise<number> {
    try {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}&api_key=${this.cryptocompareApikey}`,
      );
      return Number(response.data[to]);
    } catch {
      throw new Error('Erro na api CryptoCompare');
    }
  }

  public async createNewAddress(): Promise<string> {
    return this.client.getNewAddress();
  }

  public async getTransactionByTxid(
    txid: string,
  ): Promise<BitcoinCore.Transaction | undefined> {
    return this.client.getTransaction(txid);
  }

  public async checkValidAddress(address: string): Promise<boolean> {
    return WAVvalidator.validate(address, 'btc');
  }

  public async sendMany({
    amounts,
    minConf = 1,
    comment = '',
    subtractFeeFrom,
    replaceable = false,
    confTarget = 1,
    estimateMode = 'ECONOMICAL',
  }: ISendManyDTO): Promise<string> {
    const txid = await this.client.sendMany(
      '',
      amounts,
      minConf,
      comment,
      subtractFeeFrom,
      replaceable,
      confTarget,
      estimateMode,
    );

    return txid;
  }
}
export default Bitcoin;
