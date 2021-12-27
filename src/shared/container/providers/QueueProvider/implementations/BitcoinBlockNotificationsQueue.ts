/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { injectable, container } from 'tsyringe';
import CreateCreditDepositsService from '../../../../../modules/balances/services/CreateCreditDepositsService';
import CheckPendingBitcoinDepositsService from '../../../../../modules/bitcoin/services/CheckPendingBitcoinDepositsService';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';

export interface IBlockNotificationsParams {
  block_hash: string;
}

@injectable()
class BitcoinBlockNotificationsQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('BitcoinBlockNotificationsQueue', {
      redis: redisConfig,
    });
    this.queue.process(this.process);
  }

  public async add<T>(params: IBlockNotificationsParams): Promise<T> {
    const job = await this.queue.add(params, {
      removeOnComplete: true,
      removeOnFail: 5,
      attempts: 1,
    });
    await job.finished();
    return 'done' as unknown as T;
  }

  private process = async (job: Job): Promise<string | undefined> => {
    try {
      const newConfirmeds = await container
        .resolve(CheckPendingBitcoinDepositsService)
        .execute();

      await container
        .resolve(CreateCreditDepositsService)
        .execute(newConfirmeds);

      console.log(
        `${new Date().toISOString()} | BitcoinBlockNotificationsQueue - ${
          job.id
        } completed`,
      );
      return 'sucess';
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | BitcoinBlockNotificationsQueue - ${
          job.id
        } failed`,
        error,
      );
      return undefined;
    }
  };
}
export default BitcoinBlockNotificationsQueue;
