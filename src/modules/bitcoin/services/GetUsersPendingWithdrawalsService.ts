import { injectable, inject } from 'tsyringe';

import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';

import UserBitcoinWithdrawal from '../infra/typeorm/entities/UserBitcoinWithdrawal';

@injectable()
class GetUsersPendingWithdrawalsService {
  constructor(
    @inject('UsersBitcoinWithdrawalsRepository')
    private usersBitcoinWithdrawalsRepository: IUsersBitcoinWithdrawalsRepository,
  ) {}

  public async execute(): Promise<UserBitcoinWithdrawal[]> {
    const pendingWithdrawals =
      await this.usersBitcoinWithdrawalsRepository.findPending();
    return pendingWithdrawals;
  }
}
export default GetUsersPendingWithdrawalsService;
