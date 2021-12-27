import ICreateUserPasswordDTO from '../dtos/ICreateUserPasswordDTO';
import UserPassword from '../infra/typeorm/entities/UserPassword';

export default interface IUsersPasswordsRepository {
  create(data: ICreateUserPasswordDTO): Promise<UserPassword>;
  save(userLPassword: UserPassword): Promise<UserPassword>;
  findByUserIdAndType(
    user_id: string,
    type: 'login' | 'financial',
  ): Promise<UserPassword | undefined>;
}
