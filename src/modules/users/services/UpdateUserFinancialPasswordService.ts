import { isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '../../../shared/container/providers/HashProvider/models/IHashProvider';
import IFinancialPasswordsEventsRepository from '../repositories/IFinancialPasswordsEventsRepository';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class UpdateUserFinancialPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,

    @inject('FinancialPasswordsEventsRepository')
    private financialPasswordsEventsRepository: IFinancialPasswordsEventsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(
    user_id: string,
    verification_code: string,
    password: string,
  ): Promise<string> {
    const event = await this.financialPasswordsEventsRepository.findById(
      verification_code,
    );
    if (!event) throw new Error('Code not found');

    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new Error('User not found');

    let userPassword = await this.usersPasswordsRepository.findByUserIdAndType(
      user.id,
      'financial',
    );
    if (!userPassword) {
      userPassword = await this.usersPasswordsRepository.create({
        password_hash: 'hash',
        type: 'financial',
        user_id,
      });
    } else if (isAfter(userPassword.updated_at, event.created_at))
      throw new Error('Invalid code');

    const password_hash = await this.hashProvider.generateHash(password);

    userPassword.password_hash = password_hash;

    await this.usersPasswordsRepository.save(userPassword);

    return 'Password successfully updated';
  }
}
export default UpdateUserFinancialPasswordService;
