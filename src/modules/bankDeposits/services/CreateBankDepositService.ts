import { inject, injectable } from 'tsyringe';
import IBanksDepositsRepository from '../repositories/IBanksDepositsRepository';
import ICreateBankDepositDTO from '../dtos/ICreateBankDepositDTO';
import BankDeposit from '../infra/typeorm/entities/BankDeposit';
import IUsersRepository from '../../users/repositories/IUsersRepository';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

@injectable()
class CreateBankDepositService {
  constructor(
    @inject('BanksDepositsRepository')
    private banksDepositsRepository: IBanksDepositsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    deposit_slip,
    usd_cents,
  }: ICreateBankDepositDTO): Promise<BankDeposit> {
    const userExists = await this.usersRepository.findById(user_id);
    if (!userExists) throw new Error(`Usuário não encontrado`);

    if (usd_cents <= 0) throw new Error(`Valor deve ser maior que zero`);

    await this.storageProvider.saveFile(deposit_slip);

    const deposit = await this.banksDepositsRepository.create({
      usd_cents,
      deposit_slip,
      user_id,
    });

    return deposit;
  }
}
export default CreateBankDepositService;
