import { inject, injectable } from 'tsyringe';
import IHashProvider from '../../../shared/container/providers/HashProvider/models/IHashProvider';
import UserPassword from '../infra/typeorm/entities/UserPassword';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';

interface IParams {
  user_id: string;
  password: string;
  type: 'login' | 'financial';
}

@injectable()
class CreateUserPasswordService {
  constructor(
    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    type,
    password,
  }: IParams): Promise<UserPassword> {
    const password_hash = await this.hashProvider.generateHash(password);
    const userPassword = await this.usersPasswordsRepository.create({
      password_hash,
      type,
      user_id,
    });
    return userPassword;
  }
}
export default CreateUserPasswordService;
