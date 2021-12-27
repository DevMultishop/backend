import { inject, injectable } from 'tsyringe';
import { endOfMonth } from 'date-fns';
import ITransfersRepository from '../repositories/ITransfersRepository';
import Transfer from '../infra/typeorm/entities/Transfer';

interface IParams {
  month: number;
  year: number;
}

@injectable()
class GetAllUsersmanualBalancesByMonthService {
  constructor(
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,
  ) {}

  public async execute({ month, year }: IParams): Promise<Transfer[]> {
    const start_date = new Date(year, month);
    const end_date = endOfMonth(start_date);
    return this.transfersRepository.findAllManualBalancesByPeriod(
      start_date,
      end_date,
    );
  }
}
export default GetAllUsersmanualBalancesByMonthService;
