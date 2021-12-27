import { container } from 'tsyringe';

import IQueue from './models/IQueue';
import BitcoinTxidNotificationsQueue from './implementations/BitcoinTxidNotificationsQueue';
import BitcoinBlockNotificationsQueue from './implementations/BitcoinBlockNotificationsQueue';
import BalanceTransferQueue from './implementations/BalanceTransferQueue';
import UserPlansGainsQueue from './implementations/UserPlansGainsQueue';
import CreateBinaryNodeQueue from './implementations/CreateBinaryNodeQueue';
import DailyJobsQueue from './implementations/DailyJobsQueue';
import ProcessBitcoinWithdrawalQueue from './implementations/ProcessBitcoinWithdrawalQueue';

container.registerSingleton<IQueue>(
  'ProcessBitcoinWithdrawalQueue',
  ProcessBitcoinWithdrawalQueue,
);

container.registerSingleton<IQueue>(
  'CreateBinaryNodeQueue',
  CreateBinaryNodeQueue,
);

container.registerSingleton<IQueue>(
  'BitcoinTxidNotificationsQueue',
  BitcoinTxidNotificationsQueue,
);

container.registerSingleton<IQueue>(
  'BitcoinBlockNotificationsQueue',
  BitcoinBlockNotificationsQueue,
);

container.registerSingleton<IQueue>(
  'BalanceTransferQueue',
  BalanceTransferQueue,
);

container.registerSingleton<IQueue>('UserPlansGainsQueue', UserPlansGainsQueue);

new DailyJobsQueue().add();
