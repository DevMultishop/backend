import { getRepository, Repository } from 'typeorm';
import IUsersBinaryKeysRepository from '../../../repositories/IUsersBinaryKeysRepository';
import UserBinaryKey from '../entities/UserBinaryKey';

class UsersBinaryKeysRepository implements IUsersBinaryKeysRepository {
  private ormRepository: Repository<UserBinaryKey>;

  constructor() {
    this.ormRepository = getRepository(UserBinaryKey);
  }

  public async findByUserId(
    user_id: string,
  ): Promise<UserBinaryKey | undefined> {
    const finded = await this.ormRepository.findOne(user_id);
    return finded;
  }

  public async create(user_id: string): Promise<UserBinaryKey> {
    const key = this.ormRepository.create({ position: 'automatic', user_id });
    await this.ormRepository.save(key);
    return key;
  }

  public async save(binaryKey: UserBinaryKey): Promise<UserBinaryKey> {
    return this.ormRepository.save(binaryKey);
  }
}

export default UsersBinaryKeysRepository;
