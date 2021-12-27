import UserBitcoinWallet from '../infra/typeorm/entities/UserBitcoinWallet';

export default interface IUsersBitcoinWalletsRepository {
  create(user_id: string, value: string): Promise<UserBitcoinWallet>;
  save(wallet: UserBitcoinWallet): Promise<UserBitcoinWallet>;
  findByUserId(user_id: string): Promise<UserBitcoinWallet | undefined>;
}
