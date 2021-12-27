import { inject, injectable } from 'tsyringe';
import { IProcessBitcoinWithdrawalQueueParams } from '../../../shared/container/providers/QueueProvider/implementations/ProcessBitcoinWithdrawalQueue';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';

@injectable()
class ProcessBitcoinWithdrawalQueue {
  constructor(
    @inject('ProcessBitcoinWithdrawalQueue')
    private processBitcoinWithdrawalQueue: IQueue,
  ) {}

  public async execute(ids: string[]): Promise<void> {
    const result = await this.processBitcoinWithdrawalQueue.add({
      ids,
    } as IProcessBitcoinWithdrawalQueueParams);

    if (!result) throw new Error('Error while processing withdrawals');
  }
}
export default ProcessBitcoinWithdrawalQueue;
