import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';
import IHashProvider from '../../../shared/container/providers/HashProvider/models/IHashProvider';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import authConfig from '../../../config/auth';
import IUsersSessionsEventsRepository from '../repositories/IUsersSessionsEventsRepository';
import UserSessionEvent from '../infra/typeorm/entities/UserSessionEvent';

@injectable()
class CreateUserSessionService {
  constructor(
    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,

    @inject('UsersSessionsEventsRepository')
    private usersSessionsEventsRepository: IUsersSessionsEventsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute(
    username: string,
    password: string,
  ): Promise<UserSessionEvent> {
    const user = await this.usersRepository.findByEmail(username);
    if (!user) throw new Error('Wrong credentialssss');

    const userPassword =
      await this.usersPasswordsRepository.findByUserIdAndType(user.id, 'login');
    if (!userPassword) throw new Error('Password not found');

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userPassword.password_hash,
    );

    if (!passwordMatched) throw new Error('Wrong credentials');

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ subject: user.id }, secret, {
      expiresIn,
    });

    return this.usersSessionsEventsRepository.create(user.id, token);
  }
}
export default CreateUserSessionService;
