import { inject, injectable } from 'tsyringe';
import IHashProvider from '../../../shared/container/providers/HashProvider/models/IHashProvider';
import UserPassword from '../infra/typeorm/entities/UserPassword';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';

interface IParams {
  user_id: string;
  password: string;
}

@injectable()
class UpdateUserLoginPasswordService {
  constructor(
    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, password }: IParams): Promise<UserPassword> {
    const password_hash = await this.hashProvider.generateHash(password);
    let userPassword = await this.usersPasswordsRepository.findByUserIdAndType(
      user_id,
      'login',
    );

    if (!userPassword) {
      userPassword = await this.usersPasswordsRepository.create({
        user_id,
        password_hash,
        type: 'login',
      });
      return userPassword;
    }

    userPassword.password_hash = password_hash;
    await this.usersPasswordsRepository.save(userPassword);
    return userPassword;
  }
}
export default UpdateUserLoginPasswordService;
