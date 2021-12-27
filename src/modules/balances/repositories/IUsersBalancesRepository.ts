import ICreateUserBalanceDTO from '../dtos/ICreateUserBalanceDTO';
import UserBalance from '../infra/typeorm/entities/UserBalance';

export default interface IUsersBalancesRepository {
  create(data: ICreateUserBalanceDTO): Promise<UserBalance>;
  save(balance: UserBalance): Promise<UserBalance>;
  findByUserIdAndCard(
    data: ICreateUserBalanceDTO,
  ): Promise<UserBalance | undefined>;
  findAllByCard(
    card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<UserBalance[]>;
  sumBalanceByCard(
    card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<number>;
}
