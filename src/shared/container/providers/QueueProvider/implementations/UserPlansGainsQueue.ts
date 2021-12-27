/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { container, injectable } from 'tsyringe';
import CreateUserPlanGainService from '../../../../../modules/plans/services/CreateUserPlanGainService';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';
import Transfer from '../../../../../modules/balances/infra/typeorm/entities/Transfer';

export interface IUserPlansGainsQueueParams {
  user_id: string;
  card: 'available';
  usd_cents: number;
  description: string;
}

@injectable()
class UserPlansGainsQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('UserPlansGainsQueue', {
      redis: redisConfig,
    });
    this.queue.process(this.process);
  }

  public async add<T>(data: IUserPlansGainsQueueParams): Promise<T> {
    await this.queue.add(data, {
      removeOnComplete: 20,
      removeOnFail: 5,
      attempts: 1,
    });

    // await job.finished();

    return 'done' as unknown as T;
  }

  private process = async (job: Job): Promise<Transfer | string> => {
    try {
      const { card, description, usd_cents, user_id } =
        job.data as IUserPlansGainsQueueParams;

      await container.resolve(CreateUserPlanGainService).execute({
        card,
        description,
        usd_cents,
        user_id,
      });
      console.log(
        `${new Date().toISOString()} | UserPlansGainsQueue - ${
          job.id
        } completed`,
      );
      return 'done';
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | UserPlansGainsQueue - ${
          job.id
        } failed: `,
        error,
      );
      return 'failed';
    }
  };
}
export default UserPlansGainsQueue;
