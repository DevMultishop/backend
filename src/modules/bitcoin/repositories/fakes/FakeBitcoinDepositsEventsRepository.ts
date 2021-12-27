import { v4 } from 'uuid';
import ICreateBitcoinDepositEventDTO from '../../dtos/ICreateBitcoinDepositEventDTO';
import BitcoinDepositEvent from '../../infra/typeorm/entities/BitcoinDepositEvent';
import IBitcoinDepositsEventsRepository from '../IBitcoinDepositsEventsRepository';

class FakeBitcoinDepositsEventsRepository
  implements IBitcoinDepositsEventsRepository
{
  private events: BitcoinDepositEvent[] = [];

  public async create({
    usd_cents,
    txid,
    satoshis,
    address,
    status,
    btc_usd_conversion,
  }: ICreateBitcoinDepositEventDTO): Promise<BitcoinDepositEvent> {
    const event = new BitcoinDepositEvent();
    Object.assign(event, {
      usd_cents,
      txid,
      satoshis,
      address,
      status,
      btc_usd_conversion,
      id: v4(),
      created_at: new Date(),
    });
    this.events.push(event);
    return event;
  }

  public async findByTxid(txid: string): Promise<BitcoinDepositEvent[]> {
    return this.events.filter(e => e.txid === txid);
  }

  public async findByStatus(
    status: 'pending' | 'confirmed',
  ): Promise<BitcoinDepositEvent[]> {
    return this.events.filter(e => e.status === status);
  }

  public async save(event: BitcoinDepositEvent): Promise<BitcoinDepositEvent> {
    const index = this.events.findIndex(e => e.id === event.id);
    this.events[index] = event;
    return event;
  }
}

export default FakeBitcoinDepositsEventsRepository;
