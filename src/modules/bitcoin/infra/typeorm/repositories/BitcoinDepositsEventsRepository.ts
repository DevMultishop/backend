import { getRepository } from 'typeorm';
import ICreateBitcoinDepositEventDTO from '../../../dtos/ICreateBitcoinDepositEventDTO';
import IBitcoinDepositsEventsRepository from '../../../repositories/IBitcoinDepositsEventsRepository';
import BitcoinDepositEvent from '../entities/BitcoinDepositEvent';

class BitcoinDepositsEventsRepository
  implements IBitcoinDepositsEventsRepository
{
  constructor(private ormRepository = getRepository(BitcoinDepositEvent)) {}

  public async create({
    usd_cents,
    txid,
    satoshis,
    address,
    status,
    btc_usd_conversion,
  }: ICreateBitcoinDepositEventDTO): Promise<BitcoinDepositEvent> {
    const event = this.ormRepository.create({
      usd_cents,
      txid,
      satoshis,
      address,
      status,
      btc_usd_conversion,
    });
    await this.ormRepository.save(event);
    return event;
  }

  public async findByTxid(txid: string): Promise<BitcoinDepositEvent[]> {
    return this.ormRepository.find({ where: { txid } });
  }

  public async findByStatus(
    status: 'pending' | 'confirmed',
  ): Promise<BitcoinDepositEvent[]> {
    return this.ormRepository.find({ where: { status } });
  }

  public async save(event: BitcoinDepositEvent): Promise<BitcoinDepositEvent> {
    return this.ormRepository.save(event);
  }
}

export default BitcoinDepositsEventsRepository;
