import { getRepository, In, IsNull, Not } from 'typeorm';
import ICreateUserBitcoinWithdrawalDTO from '../../../dtos/ICreateUserBitcoinWithdrawalDTO';
import IUsersBitcoinWithdrawalsRepository from '../../../repositories/IUsersBitcoinWithdrawalsRepository';
import UserBitcoinWithdrawal from '../entities/UserBitcoinWithdrawal';

class UsersBitcoinWithdrawalsRepository
  implements IUsersBitcoinWithdrawalsRepository
{
  constructor(private ormRepository = getRepository(UserBitcoinWithdrawal)) {}

  public async findByPeriod(
    start_date: Date,
    end_date: Date,
  ): Promise<UserBitcoinWithdrawal[]> {
    const query = this.ormRepository
      .createQueryBuilder('users_bitcoin_withdrawals')
      .where(
        'users_bitcoin_withdrawals.created_at > :start_date and users_bitcoin_withdrawals.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      )
      .andWhere('users_bitcoin_withdrawals.txid IS NOT NULL')
      .leftJoinAndSelect('users_bitcoin_withdrawals.user', 'user');

    query.orderBy('users_bitcoin_withdrawals.created_at', 'DESC');

    return query.getMany();
  }

  public async findAllByPeriod(
    user_id: string,
    start_date: Date,
    end_date: Date,
  ): Promise<UserBitcoinWithdrawal[]> {
    const query = this.ormRepository
      .createQueryBuilder('users_bitcoin_withdrawals')
      .where('users_bitcoin_withdrawals.user_id = :user_id', { user_id })
      .andWhere(
        'users_bitcoin_withdrawals.created_at > :start_date and users_bitcoin_withdrawals.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    query.orderBy('users_bitcoin_withdrawals.created_at', 'DESC');

    return query.getMany();
  }

  public async findPendingByIds(
    ids: string[],
  ): Promise<UserBitcoinWithdrawal[]> {
    if (ids.length === 0) return [];
    return this.ormRepository.find({
      where: {
        txid: IsNull(),
        id: In(ids),
      },
    });
  }

  public async findConfirmedByIds(
    ids: string[],
  ): Promise<UserBitcoinWithdrawal[]> {
    if (ids.length === 0) return [];
    return this.ormRepository.find({
      where: {
        txid: Not(null),
        id: In(ids),
      },
    });
  }


  public async findPending(): Promise<UserBitcoinWithdrawal[]> {
    return this.ormRepository.find({
      where: { txid: IsNull() },
      order: {
        created_at: 'ASC',
      },
      relations: ['user'],
    });
  }

  public async create({
    user_id,
    address,
    usd_cents,
    btc_usd_conversion,
    satoshis,
  }: ICreateUserBitcoinWithdrawalDTO): Promise<UserBitcoinWithdrawal> {
    const withdrawal = this.ormRepository.create({
      usd_cents: Math.round(usd_cents),
      user_id,
      address,
      btc_usd_conversion,
      satoshis: Math.round(satoshis),
    });
    await this.ormRepository.save(withdrawal);
    return withdrawal;
  }

  public async save(
    withdrawal: UserBitcoinWithdrawal,
  ): Promise<UserBitcoinWithdrawal> {
    return this.ormRepository.save(withdrawal);
  }
}

export default UsersBitcoinWithdrawalsRepository;
