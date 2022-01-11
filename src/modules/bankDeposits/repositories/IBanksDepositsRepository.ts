import ICreateBankDepositDTO from '../dtos/ICreateBankDepositDTO';
import IListUserBankDepositsByMonthDTO from '../dtos/IListUserBankDepositsByMonthDTO';
import BankDeposit from '../infra/typeorm/entities/BankDeposit';

export default interface IBanksDepositsRepository {
  create(data: ICreateBankDepositDTO): Promise<BankDeposit>;
  save(deposit: BankDeposit): Promise<BankDeposit>;
  listUserBankDepositsByMonth(
    data: IListUserBankDepositsByMonthDTO,
  ): Promise<BankDeposit[]>;
  listUserBankDepositsByStatus(status: string): Promise<BankDeposit[]>;
  findPendingById(id: string): Promise<BankDeposit | undefined>;
}
