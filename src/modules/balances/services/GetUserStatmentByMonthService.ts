import { inject, injectable } from 'tsyringe';
import { endOfMonth } from 'date-fns';
import ITransfersRepository from '../repositories/ITransfersRepository';
import Transfer from '../infra/typeorm/entities/Transfer';

interface IParams {
  user_id: string;
  month: number;
  year: number;
  card: 'credit' | 'available' | 'income' | 'applied';
}

@injectable()
class GetUserStatmentByMonthService {
  constructor(
    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,
  ) {}

  public async execute({
    user_id,
    month,
    year,
    card,
  }: IParams): Promise<Transfer[]> {
    const start_date = new Date(year, month);
    const end_date = endOfMonth(start_date);
    return this.transfersRepository.findAllByPeriod(
      user_id,
      start_date,
      end_date,
      card,
    );
  }
}
export default GetUserStatmentByMonthService;
