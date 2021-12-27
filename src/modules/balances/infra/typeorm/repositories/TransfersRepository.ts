import { getRepository } from 'typeorm';
import ICreateTransferDTO from '../../../dtos/ICreateTransferDTO';
import ITransfersRepository from '../../../repositories/ITransfersRepository';
import Transfer from '../entities/Transfer';

class TransfersRepository implements ITransfersRepository {
  constructor(private ormRepository = getRepository(Transfer)) {}

  public async create({
    user_id,
    card,
    description,
    usd_cents,
  }: ICreateTransferDTO): Promise<Transfer> {
    const transfer = this.ormRepository.create({
      user_id,
      card,
      description,
      usd_cents: Math.round(usd_cents),
    });
    await this.ormRepository.save(transfer);
    return transfer;
  }

  public async findAllManualBalancesByPeriod(
    start_date: Date,
    end_date: Date,
  ): Promise<Transfer[]> {
    const query = this.ormRepository
      .createQueryBuilder('transfers')
      .where('transfers.description = :description', {
        description: 'Manual balance',
      })
      .andWhere(
        'transfers.created_at > :start_date and transfers.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    query.leftJoinAndSelect('transfers.user', 'user');

    query.orderBy('transfers.created_at', 'DESC');

    return query.getMany();
  }

  public async findAllByPeriod(
    user_id: string,
    start_date: Date,
    end_date: Date,
    card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<Transfer[]> {
    const query = this.ormRepository
      .createQueryBuilder('transfers')
      .where('transfers.user_id = :user_id', { user_id })
      .andWhere('transfers.card = :card', { card })
      .andWhere(
        'transfers.created_at > :start_date and transfers.created_at < :end_date',
        {
          start_date,
          end_date,
        },
      );

    query.orderBy('transfers.created_at', 'DESC');

    return query.getMany();
  }
}

export default TransfersRepository;
