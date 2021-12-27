import ICreateUserBitcoinDepositEventDTO from '../dtos/ICreateUserBitcoinDepositEventDTO';
import UserBitcoinDepositEvent from '../infra/typeorm/entities/UserBitcoinDepositEvent';

export default interface IUsersBitcoinDepositsEventsRepository {
  create(
    data: ICreateUserBitcoinDepositEventDTO,
  ): Promise<UserBitcoinDepositEvent>;
  findByAddress(address: string): Promise<UserBitcoinDepositEvent | undefined>;
  // findByUserIdAndByPeriod(user_id: string): Promise<UserBitcoinDepositEvent[]>;
}
