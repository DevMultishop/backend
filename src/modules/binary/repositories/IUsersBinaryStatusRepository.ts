import ICreateUserBinaryStatusDTO from '../dtos/ICreateUserBinaryStatusDTO';
import UserBinaryStatus from '../infra/typeorm/entities/UserBinaryStatus';

export default interface IUsersBinaryStatusRepository {
  create(data: ICreateUserBinaryStatusDTO): Promise<UserBinaryStatus>;
  findByDay(day: Date): Promise<UserBinaryStatus[]>;
  findAllByPeriod(
    user_id: string,
    start_date: Date,
    end_date: Date,
  ): Promise<UserBinaryStatus[]>;
}
