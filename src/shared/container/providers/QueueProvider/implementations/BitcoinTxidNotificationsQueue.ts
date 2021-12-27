/* eslint-disable no-console */
import Bull, { Job } from 'bull';
import { injectable, container } from 'tsyringe';
import redisConfig from '../../../../../config/redis';
import IQueue from '../models/IQueue';
import CreateBitcoinDepositEventService from '../../../../../modules/bitcoin/services/CreateBitcoinDepositEventService';

export interface ITxidNotificationsParams {
  txid: string;
}

@injectable()
class BitcoinTxidNotificationsQueue implements IQueue {
  private queue;

  constructor() {
    this.queue = new Bull('BitcoinTxidNotificationsQueue', {
      redis: redisConfig,
    });
    this.queue.process(this.process);
  }

  public async add<T>(params: ITxidNotificationsParams): Promise<T> {
    const job = await this.queue.add(params, {
      removeOnComplete: true,
      removeOnFail: 5,
      attempts: 1,
    });
    await job.finished();
    return 'done' as unknown as T;
  }

  private process = async (job: Job): Promise<string | undefined> => {
    const { txid } = job.data as ITxidNotificationsParams;

    try {
      const createBitcoinDepositEventService = container.resolve(
        CreateBitcoinDepositEventService,
      );

      await createBitcoinDepositEventService.execute({ txid });

      console.log(
        `${new Date().toISOString()} | BitcoinTxidNotificationsQueue - ${
          job.id
        } completed`,
      );
      return 'sucess';
    } catch (error) {
      console.log(
        `${new Date().toISOString()} | BitcoinTxidNotificationsQueue - ${
          job.id
        } failed for txid: ${txid}`,
      );
      return undefined;
    }
  };
}
export default BitcoinTxidNotificationsQueue;
