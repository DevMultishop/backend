/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { container, injectable } from 'tsyringe';
import CreateTransfersFromIncomeToAvailableService from '../../../../../modules/balances/services/CreateTransfersFromIncomeToAvailableService';
import CheckWithdrawalOpenService from '../../../../../modules/bitcoin/services/CheckWithdrawalOpenService';
import CreatePlanDailyIncomePaymentsService from '../../../../../modules/plans/services/CreatePlanDailyIncomePaymentsService';
import CreateDailyBinaryPaymentsService from '../../../../../modules/binary/services/CreateDailyBinaryPaymentsService';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';

@injectable()
class DailyJobsQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('DailyJobsQueue', {
      redis: redisConfig,
    });
    this.queue.process(this.process);
  }

  public async add<T>(): Promise<T> {
    await this.queue.add(
      {},
      {
        removeOnComplete: 20,
        removeOnFail: 5,
        attempts: 1,
        repeat: {
          cron: '1 0 * * *', // “At 00:01.”
        },
      },
    );

    // await job.finished();

    return 'done' as unknown as T;
  }

  private process = async (job: Job): Promise<string> => {
    try {
      await container.resolve(CreateDailyBinaryPaymentsService).execute();
      await container.resolve(CreatePlanDailyIncomePaymentsService).execute();

      const isWithdrawalOpen = await container
        .resolve(CheckWithdrawalOpenService)
        .execute();

      if (isWithdrawalOpen)
        await container
          .resolve(CreateTransfersFromIncomeToAvailableService)
          .execute();

      console.log(
        `${new Date().toISOString()} | DailyJobsQueue - ${job.id} completed`,
      );
      return 'done';
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | DailyJobsQueue - ${job.id} failed: `,
        error,
      );
      return 'failed';
    }
  };
}
export default DailyJobsQueue;
