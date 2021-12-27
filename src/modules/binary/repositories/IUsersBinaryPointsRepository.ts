import ICreateUserBinaryPointsDTO from '../dtos/ICreateUserBinaryPointsDTO';
import UserBinaryPoint from '../infra/typeorm/entities/UserBinaryPoint';

export default interface IUsersBinaryPointsRepository {
  create(data: ICreateUserBinaryPointsDTO): Promise<UserBinaryPoint>;
  findByUserIdAndDay(user_id: string, day: Date): Promise<UserBinaryPoint[]>;
  findByDay(day: Date): Promise<UserBinaryPoint[]>;
}
