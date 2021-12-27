import { IBlockNotificationsParams } from '../implementations/BitcoinBlockNotificationsQueue';
import { ITxidNotificationsParams } from '../implementations/BitcoinTxidNotificationsQueue';
import { IBalanceTransferQueueParams } from '../implementations/BalanceTransferQueue';
import { IUserPlansGainsQueueParams } from '../implementations/UserPlansGainsQueue';
import { ICreateBinaryNodeQueueParams } from '../implementations/CreateBinaryNodeQueue';
import { IProcessBitcoinWithdrawalQueueParams } from '../implementations/ProcessBitcoinWithdrawalQueue';

export default interface IQueue {
  add<T>(
    data:
      | IProcessBitcoinWithdrawalQueueParams
      | ICreateBinaryNodeQueueParams
      | IUserPlansGainsQueueParams
      | ITxidNotificationsParams
      | IBlockNotificationsParams
      | IBalanceTransferQueueParams,
  ): Promise<T>;
}
