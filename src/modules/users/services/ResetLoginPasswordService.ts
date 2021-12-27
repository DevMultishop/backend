import { isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../../../shared/container/providers/HashProvider/models/IHashProvider';
import IPasswordsForgotEventsRepository from '../repositories/IPasswordsForgotEventsRepository';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class ResetLoginPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,

    @inject('PasswordsForgotEventsRepository')
    private passwordsForgotEventsRepository: IPasswordsForgotEventsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(
    verification_code: string,
    password: string,
  ): Promise<string> {
    const forgotEvent = await this.passwordsForgotEventsRepository.findById(
      verification_code,
    );
    if (!forgotEvent) throw new Error('Code not found');

    const user = await this.usersRepository.findByEmail(forgotEvent.email);
    if (!user) throw new Error('E-mail not found');

    const userPassword =
      await this.usersPasswordsRepository.findByUserIdAndType(user.id, 'login');
    if (!userPassword) throw new Error('Password not found');

    if (isAfter(userPassword.updated_at, forgotEvent.created_at))
      throw new Error('Invalid code');

    const password_hash = await this.hashProvider.generateHash(password);

    userPassword.password_hash = password_hash;

    await this.usersPasswordsRepository.save(userPassword);

    return 'Password successfully updated';
  }
}
export default ResetLoginPasswordService;
