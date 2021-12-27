import { inject, injectable } from 'tsyringe';
import ICryptoProvider from '../../../shared/container/providers/CryptoProvider/models/ICryptoProvider';
import UserBitcoinWallet from '../infra/typeorm/entities/UserBitcoinWallet';
import IUsersBitcoinWalletsRepository from '../repositories/IUsersBitcoinWalletsRepository';

interface IParams {
  user_id: string;
  address: string;
}

@injectable()
class UpdateUserBitcoinWalletService {
  constructor(
    @inject('UsersBitcoinWalletsRepository')
    private usersBitcoinWalletsRepository: IUsersBitcoinWalletsRepository,

    @inject('Bitcoin')
    private bitcoin: ICryptoProvider,
  ) {}

  public async execute({
    user_id,
    address,
  }: IParams): Promise<UserBitcoinWallet> {
    const isValid = await this.bitcoin.checkValidAddress(address);
    if (!isValid) throw new Error('Invalid bitcoin address');
    const wallet = await this.usersBitcoinWalletsRepository.findByUserId(
      user_id,
    );
    if (!wallet) {
      return this.usersBitcoinWalletsRepository.create(user_id, address);
    }

    wallet.address = address;
    await this.usersBitcoinWalletsRepository.save(wallet);
    return wallet;
  }
}
export default UpdateUserBitcoinWalletService;
