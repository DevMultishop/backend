import { getRepository } from 'typeorm';
import ICreateUserPasswordDTO from '../../../dtos/ICreateUserPasswordDTO';
import UserPassword from '../entities/UserPassword';
import IUsersPasswordsRepository from '../../../repositories/IUsersPasswordsRepository';

class UsersPasswordsRepository implements IUsersPasswordsRepository {
  constructor(private ormRepository = getRepository(UserPassword)) {}

  public async create({
    password_hash,
    type,
    user_id,
  }: ICreateUserPasswordDTO): Promise<UserPassword> {
    const password = this.ormRepository.create({
      password_hash,
      type,
      user_id,
    });
    await this.ormRepository.save(password);
    return password;
  }

  public async save(userPassword: UserPassword): Promise<UserPassword> {
    return this.ormRepository.save(userPassword);
  }

  public async findByUserIdAndType(
    user_id: string,
    type: 'login' | 'financial',
  ): Promise<UserPassword | undefined> {
    return this.ormRepository.findOne({
      where: {
        user_id,
        type,
      },
    });
  }
}
export default UsersPasswordsRepository;
