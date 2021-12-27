import { inject, injectable } from 'tsyringe';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';
import Transfer from '../infra/typeorm/entities/Transfer';

interface IProps {
  user_id: string;
  usd_cents: number;
}

@injectable()
class CreateUserManualBalanceService {
  constructor(
    @inject('BalanceTransferQueue')
    private balanceTransferQueue: IQueue,
  ) {}

  public async execute({ usd_cents, user_id }: IProps): Promise<Transfer> {
    return this.balanceTransferQueue.add<Transfer>({
      user_id,
      card: 'credit',
      usd_cents,
      description: 'Manual balance',
    });
  }
}
export default CreateUserManualBalanceService;
