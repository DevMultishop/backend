import { inject, injectable } from 'tsyringe';
import UserBitcoinWallet from '../infra/typeorm/entities/UserBitcoinWallet';
import IUsersBitcoinWalletsRepository from '../repositories/IUsersBitcoinWalletsRepository';

interface IParams {
  user_id: string;
}

@injectable()
class GetUserBitcoinWalletService {
  constructor(
    @inject('UsersBitcoinWalletsRepository')
    private usersBitcoinWalletsRepository: IUsersBitcoinWalletsRepository,
  ) {}

  public async execute({
    user_id,
  }: IParams): Promise<UserBitcoinWallet | undefined> {
    const wallet = await this.usersBitcoinWalletsRepository.findByUserId(
      user_id,
    );
    return wallet;
  }
}
export default GetUserBitcoinWalletService;
