import { inject, injectable } from 'tsyringe';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';
import IHashProvider from '../../../shared/container/providers/HashProvider/models/IHashProvider';

interface IParams {
  user_id: string;
  password: string;
}

@injectable()
class VerifyFinancialPasswordService {
  constructor(
    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,

    @inject('HashProvider') private hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, password }: IParams): Promise<boolean> {
    const userPassword =
      await this.usersPasswordsRepository.findByUserIdAndType(
        user_id,
        'financial',
      );
    if (!userPassword) throw new Error('Password not found');

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      userPassword.password_hash,
    );

    if (!passwordMatched) throw new Error('Wrong password');

    return true;
  }
}
export default VerifyFinancialPasswordService;
