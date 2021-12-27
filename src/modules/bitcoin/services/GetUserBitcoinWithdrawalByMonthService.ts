import { injectable, inject } from 'tsyringe';

import { endOfMonth } from 'date-fns';

import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';

import UserBitcoinWithdrawal from '../infra/typeorm/entities/UserBitcoinWithdrawal';

interface IParams {
  user_id: string;
  month: number;
  year: number;
}

@injectable()
class GetUserBitcoinWithdrawalByMonthService {
  constructor(
    @inject('UsersBitcoinWithdrawalsRepository')
    private usersBitcoinWithdrawalsRepository: IUsersBitcoinWithdrawalsRepository,
  ) {}

  public async execute({
    user_id,
    month,
    year,
  }: IParams): Promise<UserBitcoinWithdrawal[]> {
    const start_date = new Date(year, month);
    const end_date = endOfMonth(start_date);

    const items = await this.usersBitcoinWithdrawalsRepository.findAllByPeriod(
      user_id,
      start_date,
      end_date,
    );
    return items;
  }
}
export default GetUserBitcoinWithdrawalByMonthService;
