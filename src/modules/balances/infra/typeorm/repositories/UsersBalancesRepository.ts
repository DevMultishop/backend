import { getRepository } from 'typeorm';
import ICreateUserBalanceDTO from '../../../dtos/ICreateUserBalanceDTO';
import IUsersBalancesRepository from '../../../repositories/IUsersBalancesRepository';
import UserBalance from '../entities/UserBalance';

class UsersBalancesRepository implements IUsersBalancesRepository {
  constructor(private ormRepository = getRepository(UserBalance)) {}

  public async create({
    user_id,
    card,
  }: ICreateUserBalanceDTO): Promise<UserBalance> {
    const balance = this.ormRepository.create({
      card,
      usd_cents: 0,
      user_id,
    });
    await this.ormRepository.save(balance);
    return balance;
  }

  public async sumBalanceByCard(
    card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<number> {
    const query = this.ormRepository
      .createQueryBuilder('users_balances')
      .select('SUM(users_balances.usd_cents)', 'sum')
      .where('users_balances.card = :card', { card });

    const { sum } = await query.getRawOne();

    return Number(sum) || 0;
  }

  public async save(balance: UserBalance): Promise<UserBalance> {
    return this.ormRepository.save(balance);
  }

  public async findByUserIdAndCard({
    user_id,
    card,
  }: ICreateUserBalanceDTO): Promise<UserBalance | undefined> {
    return this.ormRepository.findOne({ where: { card, user_id } });
  }

  public async findAllByCard(
    card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<UserBalance[]> {
    return this.ormRepository.find({ where: { card } });
  }
}

export default UsersBalancesRepository;
