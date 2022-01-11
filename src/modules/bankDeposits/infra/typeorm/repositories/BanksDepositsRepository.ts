import { getRepository, Repository, Between } from 'typeorm';
import ICreateBankDepositDTO from '../../../dtos/ICreateBankDepositDTO';
import IListUserBankDepositsByMonthDTO from '../../../dtos/IListUserBankDepositsByMonthDTO';
import IBanksDepositsRepository from '../../../repositories/IBanksDepositsRepository';
import BankDeposit from '../entities/BankDeposit';

class BanksDepositsRepository implements IBanksDepositsRepository {
  private ormRepository: Repository<BankDeposit>;

  constructor() {
    this.ormRepository = getRepository(BankDeposit);
  }

  public async findPendingById(id: string): Promise<BankDeposit | undefined> {
    const finded = await this.ormRepository.findOne({
      where: {
        id,
        status: 'pending',
      },
    });
    return finded;
  }

  public async listUserBankDepositsByMonth({
    user_id,
    end_of_month,
    start_of_month,
  }: IListUserBankDepositsByMonthDTO): Promise<BankDeposit[]> {
    const transactions = await this.ormRepository.find({
      where: {
        user_id,
        created_at: Between(start_of_month, end_of_month),
      },
      order: { created_at: 'DESC' },
    });
    return transactions;
  }

  public async listUserBankDepositsByStatus(
    status: string,
  ): Promise<BankDeposit[]> {
    const transactions = await this.ormRepository.find({
      where: {
        status,
      },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
    return transactions;
  }

  public async save(bankDeposit: BankDeposit): Promise<BankDeposit> {
    return this.ormRepository.save(bankDeposit);
  }

  public async create({
    usd_cents,
    deposit_slip,
    user_id,
  }: ICreateBankDepositDTO): Promise<BankDeposit> {
    const transaction = this.ormRepository.create({
      usd_cents,
      deposit_slip,
      user_id,
      status: 'pending',
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }
}

export default BanksDepositsRepository;
