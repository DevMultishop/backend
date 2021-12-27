import { getRepository } from 'typeorm';
import IUsersBitcoinDepositsEventsRepository from '../../../repositories/IUsersBitcoinDepositsEventsRepository';
import ICreateUserBitcoinDepositEventDTO from '../../../dtos/ICreateUserBitcoinDepositEventDTO';
import UserBitcoinDepositEvent from '../entities/UserBitcoinDepositEvent';

class UsersBitcoinDepositsEventsRepository
  implements IUsersBitcoinDepositsEventsRepository
{
  constructor(private ormRepository = getRepository(UserBitcoinDepositEvent)) {}

  public async create({
    user_id,
    address,
    satoshis,
    usd_cents,
    btc_usd_conversion,
  }: ICreateUserBitcoinDepositEventDTO): Promise<UserBitcoinDepositEvent> {
    const event = this.ormRepository.create({
      user_id,
      address,
      satoshis: Math.round(satoshis),
      usd_cents: Math.floor(usd_cents),
      btc_usd_conversion,
    });
    await this.ormRepository.save(event);
    return event;
  }

  public async findByAddress(
    address: string,
  ): Promise<UserBitcoinDepositEvent | undefined> {
    return this.ormRepository.findOne({ where: { address } });
  }
}
export default UsersBitcoinDepositsEventsRepository;
