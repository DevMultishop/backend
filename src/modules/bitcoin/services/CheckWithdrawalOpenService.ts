import { injectable } from 'tsyringe';

@injectable()
class CheckWithdrawalOpenService {
  public async execute(): Promise<boolean> {
    const now = new Date();
    if (now.getDate() === 1) return true;

    if (now.getDay() === 5) return true;

    return true;
  }
}
export default CheckWithdrawalOpenService;
