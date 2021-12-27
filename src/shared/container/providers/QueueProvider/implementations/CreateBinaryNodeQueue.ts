/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { container, injectable } from 'tsyringe';
import CreateBinaryNodeService from '../../../../../modules/binary/services/CreateBinaryNodeService';
import BinaryNode from '../../../../../modules/binary/infra/typeorm/entities/BinaryNode';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';

export interface ICreateBinaryNodeQueueParams {
  user_id: string;
}

@injectable()
class CreateBinaryNodeQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('CreateBinaryNodeQueue', {
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

  public async add<T>(data: ICreateBinaryNodeQueueParams): Promise<T> {
    const job = await this.queue.add(data, {
      removeOnComplete: 20,
      removeOnFail: 5,
      attempts: 1,
    });

    return this.awaitToComplete<T>(String(job.id));
  }

  private process = async (job: Job): Promise<BinaryNode | string> => {
    try {
      const { user_id } = job.data as ICreateBinaryNodeQueueParams;

      const node = await container.resolve(CreateBinaryNodeService).execute({
        user_id,
      });
      console.log(
        `${new Date().toISOString()} | CreateBinaryNodeQueue - ${
          job.id
        } completed`,
      );
      return node;
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | CreateBinaryNodeQueue - ${
          job.id
        } failed: `,
        error,
      );
      return 'failed';
    }
  };
}
export default CreateBinaryNodeQueue;
