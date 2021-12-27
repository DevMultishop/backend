import { inject, injectable } from 'tsyringe';
import ICreateTransferDTO from '../../balances/dtos/ICreateTransferDTO';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';

@injectable()
class EnqueueUserPlanGainService {
  constructor(
    @inject('UserPlansGainsQueue')
    private userPlansGainsQueue: IQueue,
  ) {}

  public async execute(transfers: ICreateTransferDTO[]): Promise<string> {
    await Promise.all(
      transfers.map(transfer => this.userPlansGainsQueue.add(transfer)),
    );
    return 'done';
  }
}
export default EnqueueUserPlanGainService;
