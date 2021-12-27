import { endOfMonth } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import UserBinaryStatus from '../infra/typeorm/entities/UserBinaryStatus';
import IUsersBinaryStatusRepository from '../repositories/IUsersBinaryStatusRepository';

interface IParams {
  user_id: string;
  month: number;
  year: number;
}

@injectable()
class GetDailyResultsByMonthService {
  constructor(
    @inject('UsersBinaryStatusRepository')
    private usersBinaryStatusRepository: IUsersBinaryStatusRepository,
  ) {}

  public async execute({
    user_id,
    year,
    month,
  }: IParams): Promise<UserBinaryStatus[]> {
    const start_date = new Date(year, month);
    const end_date = endOfMonth(start_date);
    return this.usersBinaryStatusRepository.findAllByPeriod(
      user_id,
      start_date,
      end_date,
    );
  }
}
export default GetDailyResultsByMonthService;
