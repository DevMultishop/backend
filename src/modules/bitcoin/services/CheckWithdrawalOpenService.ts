import { injectable } from 'tsyringe';

@injectable()
class CheckWithdrawalOpenService {
  public async execute(): Promise<boolean> {
    const now = new Date();
    if (now.getDate() === 5) return true; // Dia 05 do mês

    if (now.getDay() === 3) return true; // Quarta Feira

    return true;
  }
}
export default CheckWithdrawalOpenService;
