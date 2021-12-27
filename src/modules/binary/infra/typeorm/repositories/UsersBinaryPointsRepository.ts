import { endOfDay, startOfDay } from 'date-fns';
import { getRepository } from 'typeorm';
import ICreateUserBinaryPointsDTO from '../../../dtos/ICreateUserBinaryPointsDTO';
import IUsersBinaryPointsRepository from '../../../repositories/IUsersBinaryPointsRepository';
import UserBinaryPoint from '../entities/UserBinaryPoint';

class UsersBinaryPointsRepository implements IUsersBinaryPointsRepository {
  constructor(private ormRepository = getRepository(UserBinaryPoint)) {}

  public async create({
    position,
    from_user_id,
    points,
    user_id,
  }: ICreateUserBinaryPointsDTO): Promise<UserBinaryPoint> {
    const userPoints = this.ormRepository.create({
      position,
      from_user_id,
      points,
      user_id,
    });
    await this.ormRepository.save(userPoints);
    return userPoints;
  }

  public async findByDay(day: Date): Promise<UserBinaryPoint[]> {
    const start_date = startOfDay(day);
    const end_date = endOfDay(start_date);
    const query = this.ormRepository
      .createQueryBuilder('users_binary_points')
      .where(
        'users_binary_points.created_at > :start_date and users_binary_points.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    // query.leftJoinAndSelect('users_binary_points.from_user', 'from_user');

    query.orderBy('users_binary_points.created_at', 'DESC');

    return query.getMany();
  }

  public async findByUserIdAndDay(
    user_id: string,
    day: Date,
  ): Promise<UserBinaryPoint[]> {
    const start_date = startOfDay(day);
    const end_date = endOfDay(start_date);
    const query = this.ormRepository
      .createQueryBuilder('users_binary_points')
      .where('users_binary_points.user_id = :user_id', { user_id })
      .andWhere(
        'users_binary_points.created_at > :start_date and users_binary_points.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    query.leftJoinAndSelect('users_binary_points.from_user', 'from_user');

    query.orderBy('users_binary_points.created_at', 'DESC');

    return query.getMany();
  }
}
export default UsersBinaryPointsRepository;
