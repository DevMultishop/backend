import { getRepository } from 'typeorm';
import IUsersBitcoinWalletsRepository from '../../../repositories/IUsersBitcoinWalletsRepository';
import UserBitcoinWallet from '../entities/UserBitcoinWallet';

class UsersBitcoinWalletsRepository implements IUsersBitcoinWalletsRepository {
  constructor(private ormRepository = getRepository(UserBitcoinWallet)) {}

  public async create(
    user_id: string,
    address: string,
  ): Promise<UserBitcoinWallet> {
    const wallet = this.ormRepository.create({ user_id, address });
    await this.ormRepository.save(wallet);
    return wallet;
  }

  public async save(wallet: UserBitcoinWallet): Promise<UserBitcoinWallet> {
    return this.ormRepository.save(wallet);
  }

  findByUserId(user_id: string): Promise<UserBitcoinWallet | undefined> {
    return this.ormRepository.findOne({ where: { user_id } });
  }
}
export default UsersBitcoinWalletsRepository;
