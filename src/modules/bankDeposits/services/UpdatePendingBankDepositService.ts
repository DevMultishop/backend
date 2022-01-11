import { inject, injectable } from 'tsyringe';

import IBanksDepositsRepository from '../repositories/IBanksDepositsRepository';
import BankDeposit from '../infra/typeorm/entities/BankDeposit';

interface IParams {
  bank_deposit_id: string;
  status: 'accepted' | 'rejected';
  admin_answear: string;
  usd_cents: number;
}

@injectable()
class UpdatePendingBankDepositService {
  constructor(
    @inject('BanksDepositsRepository')
    private banksDepositsRepository: IBanksDepositsRepository,
  ) {}

  public async execute({
    admin_answear,
    bank_deposit_id,
    status,
    usd_cents,
  }: IParams): Promise<BankDeposit> {
    const deposit = await this.banksDepositsRepository.findPendingById(
      bank_deposit_id,
    );
    if (!deposit) throw new Error('Depósito não encontrado');

    deposit.admin_answear = admin_answear;
    deposit.status = status;
    deposit.usd_cents = usd_cents;

    return this.banksDepositsRepository.save(deposit);
  }
}
export default UpdatePendingBankDepositService;
