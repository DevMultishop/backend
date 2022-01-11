import ICreateUserBitcoinWithdrawalDTO from '../dtos/ICreateUserBitcoinWithdrawalDTO';
import UserBitcoinWithdrawal from '../infra/typeorm/entities/UserBitcoinWithdrawal';

export default interface IUsersBitcoinWithdrawalsRepository {
  create(data: ICreateUserBitcoinWithdrawalDTO): Promise<UserBitcoinWithdrawal>;
  save(withdrawal: UserBitcoinWithdrawal): Promise<UserBitcoinWithdrawal>;
  findAllByPeriod(
    user_id: string,
    start_date: Date,
    end_date: Date,
  ): Promise<UserBitcoinWithdrawal[]>;
  findByPeriod(
    start_date: Date,
    end_date: Date,
  ): Promise<UserBitcoinWithdrawal[]>;
  findPending(): Promise<UserBitcoinWithdrawal[]>;
  findPendingByIds(isd: string[]): Promise<UserBitcoinWithdrawal[]>;
  findConfirmedByIds(isd: string[]): Promise<UserBitcoinWithdrawal[]>;
}
