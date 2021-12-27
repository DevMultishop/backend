import ICreateBitcoinDepositEventDTO from '../dtos/ICreateBitcoinDepositEventDTO';
import BitcoinDepositEvent from '../infra/typeorm/entities/BitcoinDepositEvent';

export default interface IBitcoinDepositsEventsRepository {
  create(data: ICreateBitcoinDepositEventDTO): Promise<BitcoinDepositEvent>;
  findByTxid(txid: string): Promise<BitcoinDepositEvent[]>;
  findByStatus(status: 'pending' | 'confirmed'): Promise<BitcoinDepositEvent[]>;
  save(event: BitcoinDepositEvent): Promise<BitcoinDepositEvent>;
  // findByAddressesAndByPeriod(
  //   addresses: string[],
  //   start_date: Date,
  //   end_date: Date,
  // ): Promise<BitcoinDepositEvent[]>;
}
