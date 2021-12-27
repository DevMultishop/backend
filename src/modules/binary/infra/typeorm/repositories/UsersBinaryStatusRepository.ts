import { endOfDay, startOfDay } from 'date-fns';
import { getRepository } from 'typeorm';
import ICreateUserBinaryStatusDTO from '../../../dtos/ICreateUserBinaryStatusDTO';
import IUsersBinaryStatusRepository from '../../../repositories/IUsersBinaryStatusRepository';
import UserBinaryStatus from '../entities/UserBinaryStatus';

class UsersBinaryStatusRepository implements IUsersBinaryStatusRepository {
  constructor(private ormRepository = getRepository(UserBinaryStatus)) {}

  public async create({
    bonus_usd_cents,
    left_points,
    max_usd_cents,
    right_points,
    user_id,
  }: ICreateUserBinaryStatusDTO): Promise<UserBinaryStatus> {
    const status = this.ormRepository.create({
      bonus_usd_cents,
      left_points,
      max_usd_cents,
      user_id,
      right_points,
    });
    await this.ormRepository.save(status);
    return status;
  }

  public async findByDay(day: Date): Promise<UserBinaryStatus[]> {
    const start_date = startOfDay(day);
    const end_date = endOfDay(start_date);
    const query = this.ormRepository
      .createQueryBuilder('users_binary_status')
      .where(
        'users_binary_status.created_at > :start_date and users_binary_status.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    // query.leftJoinAndSelect('users_binary_status.from_user', 'from_user');

    query.orderBy('users_binary_status.created_at', 'DESC');

    return query.getMany();
  }

  public async findAllByPeriod(
    user_id: string,
    start_date: Date,
    end_date: Date,
  ): Promise<UserBinaryStatus[]> {
    const query = this.ormRepository
      .createQueryBuilder('users_binary_status')
      .where('users_binary_status.user_id = :user_id', { user_id })
      .andWhere(
        'users_binary_status.created_at > :start_date and users_binary_status.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    query.orderBy('users_binary_status.created_at', 'DESC');

    return query.getMany();
  }
}
export default UsersBinaryStatusRepository;
