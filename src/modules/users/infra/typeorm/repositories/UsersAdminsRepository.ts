import { getRepository } from 'typeorm';
import IUsersAdminsRepository from '../../../repositories/IUsersAdminsRepository';
import UserAdmin from '../entities/UserAdmin';

class UsersAdminsRepository implements IUsersAdminsRepository {
  constructor(private ormRepository = getRepository(UserAdmin)) {}

  public async findByUserId(user_id: string): Promise<UserAdmin | undefined> {
    return this.ormRepository.findOne({ where: { user_id } });
  }
}

export default UsersAdminsRepository;
