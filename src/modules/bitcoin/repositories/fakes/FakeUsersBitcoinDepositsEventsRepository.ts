import { v4 } from 'uuid';
import ICreateUserBitcoinDepositEventDTO from '../../dtos/ICreateUserBitcoinDepositEventDTO';
import UserBitcoinDepositEvent from '../../infra/typeorm/entities/UserBitcoinDepositEvent';
import IUsersBitcoinDepositsEventsRepository from '../IUsersBitcoinDepositsEventsRepository';

class FakeUsersBitcoinDepositsEventsRepository
  implements IUsersBitcoinDepositsEventsRepository
{
  private events: UserBitcoinDepositEvent[] = [];

  public async create({
    user_id,
    address,
    satoshis,
    usd_cents,
    btc_usd_conversion,
  }: ICreateUserBitcoinDepositEventDTO): Promise<UserBitcoinDepositEvent> {
    const event = new UserBitcoinDepositEvent();
    Object.assign(event, {
      user_id,
      address,
      satoshis,
      usd_cents,
      btc_usd_conversion,
      id: v4(),
      created_at: new Date(),
    });
    this.events.push(event);
    return event;
  }

  public async findByAddress(
    address: string,
  ): Promise<UserBitcoinDepositEvent | undefined> {
    return this.events.find(e => e.address === address);
  }
}
export default FakeUsersBitcoinDepositsEventsRepository;
