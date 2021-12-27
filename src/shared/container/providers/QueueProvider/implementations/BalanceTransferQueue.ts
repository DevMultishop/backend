/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { container, injectable } from 'tsyringe';
import CreateBalanceTransferService from '../../../../../modules/balances/services/CreateBalanceTransferService';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';
import Transfer from '../../../../../modules/balances/infra/typeorm/entities/Transfer';

export interface IBalanceTransferQueueParams {
  user_id: string;
  usd_cents: number;
  description: string;
  card: 'credit' | 'available' | 'income' | 'applied';
}

@injectable()
class BalanceTransferQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('BalanceTransferQueue', {
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

  public async add<T>(data: IBalanceTransferQueueParams): Promise<T> {
    const job = await this.queue.add(data, {
      removeOnComplete: 20,
      removeOnFail: 5,
      attempts: 1,
    });

    return this.awaitToComplete<T>(String(job.id));
  }

  private process = async (job: Job): Promise<Transfer | string> => {
    try {
      const { card, description, usd_cents, user_id } =
        job.data as IBalanceTransferQueueParams;

      const transfer = await container
        .resolve(CreateBalanceTransferService)
        .execute({
          card,
          description,
          usd_cents,
          user_id,
        });
      console.log(
        `${new Date().toISOString()} | BalanceTransferQueue - ${
          job.id
        } completed`,
      );
      return transfer;
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | BalanceTransferQueue - ${
          job.id
        } failed: `,
        error,
      );
      return 'failed';
    }
  };
}
export default BalanceTransferQueue;
