import { v4 } from 'uuid';
import ICreateTransferDTO from '../../dtos/ICreateTransferDTO';
import Transfer from '../../infra/typeorm/entities/Transfer';
import ITransfersRepository from '../ITransfersRepository';

class FakeTransfersRepository implements ITransfersRepository {
  private transfers: Transfer[] = [];

  public async create({
    user_id,
    card,
    description,
    usd_cents,
  }: ICreateTransferDTO): Promise<Transfer> {
    const transfer = new Transfer();
    Object.assign(transfer, {
      user_id,
      card,
      description,
      usd_cents,
      created_at: new Date(),
      id: v4(),
    });
    this.transfers.push(transfer);
    return transfer;
  }

  public async findAllManualBalancesByPeriod(): Promise<Transfer[]> {
    return this.transfers;
  }

  public async findAllByPeriod(): Promise<Transfer[]> {
    return this.transfers;
  }
}

export default FakeTransfersRepository;
