import { v4 } from 'uuid';
import ICreateUserPasswordDTO from '../../dtos/ICreateUserPasswordDTO';
import UserPassword from '../../infra/typeorm/entities/UserPassword';
import IUsersPasswordsRepository from '../IUsersPasswordsRepository';

class FakeUsersPasswordsRepository implements IUsersPasswordsRepository {
  private passwords: UserPassword[] = [];

  public async create({
    password_hash,
    type,
    user_id,
  }: ICreateUserPasswordDTO): Promise<UserPassword> {
    const password = new UserPassword();
    Object.assign(password, {
      password_hash,
      type,
      user_id,
      id: v4(),
      updated_at: new Date(),
    });

    this.passwords.push(password);

    return password;
  }

  public async save(userPassword: UserPassword): Promise<UserPassword> {
    const index = this.passwords.findIndex(p => p.id === userPassword.id);
    this.passwords[index] = userPassword;
    return userPassword;
  }

  public async findByUserIdAndType(
    user_id: string,
    type: 'login' | 'financial',
  ): Promise<UserPassword | undefined> {
    return this.passwords.find(p => p.user_id === user_id && p.type === type);
  }
}
export default FakeUsersPasswordsRepository;
