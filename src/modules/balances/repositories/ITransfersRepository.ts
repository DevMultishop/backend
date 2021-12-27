import ICreateTransferDTO from '../dtos/ICreateTransferDTO';
import Transfer from '../infra/typeorm/entities/Transfer';

export default interface ITransfersRepository {
  create(data: ICreateTransferDTO): Promise<Transfer>;
  findAllByPeriod(
    user_id: string,
    start_date: Date,
    end_date: Date,
    card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<Transfer[]>;
  findAllManualBalancesByPeriod(
    start_date: Date,
    end_date: Date,
  ): Promise<Transfer[]>;
}
