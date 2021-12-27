import { inject, injectable } from 'tsyringe';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';

@injectable()
class CheckFinancialPasswordService {
  constructor(
    @inject('UsersPasswordsRepository')
    private usersPasswordsRepository: IUsersPasswordsRepository,
  ) {}

  public async execute(user_id: string): Promise<boolean> {
    const userPassword =
      await this.usersPasswordsRepository.findByUserIdAndType(
        user_id,
        'financial',
      );
    return !!userPassword;
  }
}
export default CheckFinancialPasswordService;
