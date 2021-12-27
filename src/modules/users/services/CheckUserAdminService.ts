import { inject, injectable } from 'tsyringe';
import IUsersAdminsRepository from '../repositories/IUsersAdminsRepository';

@injectable()
class CheckUserAdminService {
  constructor(
    @inject('UsersAdminsRepository')
    private usersAdminsRepository: IUsersAdminsRepository,
  ) {}

  public async execute(user_id: string): Promise<boolean> {
    const isAdmin = await this.usersAdminsRepository.findByUserId(user_id);
    if (!isAdmin) throw new Error('Not allowed');

    if (!isAdmin.is_active) throw new Error('Not allowed');

    return isAdmin.is_active;
  }
}
export default CheckUserAdminService;
