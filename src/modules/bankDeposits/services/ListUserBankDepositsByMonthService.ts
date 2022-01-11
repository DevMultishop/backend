import { inject, injectable } from 'tsyringe';

import IBanksDepositsRepository from '../repositories/IBanksDepositsRepository';
import BankDeposit from '../infra/typeorm/entities/BankDeposit';
import IListUserBankDepositsByMonthDTO from '../dtos/IListUserBankDepositsByMonthDTO';

@injectable()
class ListUserBankDepositsByMonthService {
  constructor(
    @inject('BanksDepositsRepository')
    private banksDepositsRepository: IBanksDepositsRepository,
  ) {}

  public async execute({
    user_id,
    end_of_month,
    start_of_month,
  }: IListUserBankDepositsByMonthDTO): Promise<BankDeposit[]> {
    const deposits =
      await this.banksDepositsRepository.listUserBankDepositsByMonth({
        user_id,
        end_of_month,
        start_of_month,
      });

    return deposits;
  }
}
export default ListUserBankDepositsByMonthService;
