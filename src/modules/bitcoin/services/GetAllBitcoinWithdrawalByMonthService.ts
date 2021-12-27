import { injectable, inject } from 'tsyringe';

import { endOfMonth } from 'date-fns';

import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';

import UserBitcoinWithdrawal from '../infra/typeorm/entities/UserBitcoinWithdrawal';

interface IParams {
  month: number;
  year: number;
}

@injectable()
class GetAllBitcoinWithdrawalByMonthService {
  constructor(
    @inject('UsersBitcoinWithdrawalsRepository')
    private usersBitcoinWithdrawalsRepository: IUsersBitcoinWithdrawalsRepository,
  ) {}

  public async execute({
    month,
    year,
  }: IParams): Promise<UserBitcoinWithdrawal[]> {
    const start_date = new Date(year, month);
    const end_date = endOfMonth(start_date);

    const items = await this.usersBitcoinWithdrawalsRepository.findByPeriod(
      start_date,
      end_date,
    );
    return items;
  }
}
export default GetAllBitcoinWithdrawalByMonthService;
