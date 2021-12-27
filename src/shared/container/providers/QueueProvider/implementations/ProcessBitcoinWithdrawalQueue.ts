/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { container, injectable } from 'tsyringe';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';
import ProcessUsersBitcoinWithdrawalService from '../../../../../modules/bitcoin/services/ProcessUsersBitcoinWithdrawalService';

export interface IProcessBitcoinWithdrawalQueueParams {
  ids: string[];
}

@injectable()
class ProcessBitcoinWithdrawalQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('ProcessBitcoinWithdrawalQueue', {
      redis: redisConfig,
    });
    this.queue.process(this.process);
  }

  private async awaitToComplete<T>(id: string): Promise<T> {
    const awaitToComplete = async (): Promise<T> => {
      await new Promise(r => setTimeout(r, 50));
      const job = await this.queue.getJob(id);
      const result = job?.returnvalue;
      if (!result) return awaitToComplete();
      if (result === 'failed') return undefined as unknown as T;
      await job.remove();
      return result;
    };
    return awaitToComplete();
  }

  public async add<T>(data: IProcessBitcoinWithdrawalQueueParams): Promise<T> {
    const job = await this.queue.add(data, {
      removeOnComplete: 20,
      removeOnFail: 5,
      attempts: 1,
    });

    return this.awaitToComplete<T>(String(job.id));
  }

  private process = async (job: Job): Promise<string> => {
    try {
      const { ids } = job.data as IProcessBitcoinWithdrawalQueueParams;

      await container
        .resolve(ProcessUsersBitcoinWithdrawalService)
        .execute(ids);

      console.log(
        `${new Date().toISOString()} | ProcessBitcoinWithdrawalQueue - ${
          job.id
        } completed`,
      );
      return 'sucess';
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | ProcessBitcoinWithdrawalQueue - ${
          job.id
        } failed: `,
        error,
      );
      return 'failed';
    }
  };
}
export default ProcessBitcoinWithdrawalQueue;
