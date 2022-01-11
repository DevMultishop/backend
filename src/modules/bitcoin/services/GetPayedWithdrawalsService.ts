import { inject, injectable } from 'tsyringe';
import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';
import UserBitcoinWithdrawal from '../infra/typeorm/entities/UserBitcoinWithdrawal';


@injectable()
class GetPayedWithdrawalsService {
  constructor(
    @inject('UsersBitcoinWithdrawalsRepository')
    private usersBitcoinWithdrawalsRepository: IUsersBitcoinWithdrawalsRepository,

  ) {}

  public async execute(ids: string[]): Promise<UserBitcoinWithdrawal[]> {
    const bitcoinWithdrawals =
      await this.usersBitcoinWithdrawalsRepository.findConfirmedByIds(ids);
    return bitcoinWithdrawals
  }
}
export default GetPayedWithdrawalsService;
