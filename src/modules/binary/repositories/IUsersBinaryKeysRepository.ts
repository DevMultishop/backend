import UserBinaryKey from '../infra/typeorm/entities/UserBinaryKey';

export default interface IUsersBinaryKeysRepository {
  create(user_id: string): Promise<UserBinaryKey>;
  save(binaryKey: UserBinaryKey): Promise<UserBinaryKey>;
  findByUserId(user_id: string): Promise<UserBinaryKey | undefined>;
}
