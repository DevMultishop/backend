import IGetCoinParValueDTO from '../dtos/IGetCoinParValueDTO';
import ISendManyDTO from '../dtos/ISendManyDTO';

export default interface ICryptoProvider {
  getCoinsPrice(data: IGetCoinParValueDTO): Promise<number>;
  createNewAddress(): Promise<string>;
  getTransactionByTxid(
    txid: string,
  ): Promise<BitcoinCore.Transaction | undefined>;
  checkValidAddress(address: string): Promise<boolean>;
  sendMany(data: ISendManyDTO): Promise<string>;
}
