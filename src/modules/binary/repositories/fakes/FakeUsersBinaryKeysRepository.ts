import UserBinaryKey from '../../infra/typeorm/entities/UserBinaryKey';

import IUsersBinaryKeysRepository from '../IUsersBinaryKeysRepository';

class FakeUsersBinaryKeysRepository implements IUsersBinaryKeysRepository {
  private keys: UserBinaryKey[] = [];

  public async findByUserId(
    user_id: string,
  ): Promise<UserBinaryKey | undefined> {
    const finded = this.keys.find(key => key.user_id === user_id);
    return finded;
  }

  public async create(user_id: string): Promise<UserBinaryKey> {
    const key = new UserBinaryKey();
    Object.assign(key, {
      user_id,
      position: 'automatic',
    });
    this.keys.push(key);
    return key;
  }

  public async save(binaryKey: UserBinaryKey): Promise<UserBinaryKey> {
    const findIndex = this.keys.findIndex(
      key => key.user_id === binaryKey.user_id,
    );
    this.keys[findIndex] = binaryKey;
    return binaryKey;
  }
}

export default FakeUsersBinaryKeysRepository;
