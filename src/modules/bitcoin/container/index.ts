import { container } from 'tsyringe';
import BitcoinDepositsEventsRepository from '../infra/typeorm/repositories/BitcoinDepositsEventsRepository';
import UsersBitcoinDepositsEventsRepository from '../infra/typeorm/repositories/UsersBitcoinDepositsEventsRepository';
import UsersBitcoinWithdrawalsRepository from '../infra/typeorm/repositories/UsersBitcoinWithdrawalsRepository';
import IBitcoinDepositsEventsRepository from '../repositories/IBitcoinDepositsEventsRepository';
import IUsersBitcoinDepositsEventsRepository from '../repositories/IUsersBitcoinDepositsEventsRepository';
import IUsersBitcoinWithdrawalsRepository from '../repositories/IUsersBitcoinWithdrawalsRepository';

container.registerSingleton<IUsersBitcoinDepositsEventsRepository>(
  'UsersBitcoinDepositsEventsRepository',
  UsersBitcoinDepositsEventsRepository,
);

container.registerSingleton<IBitcoinDepositsEventsRepository>(
  'BitcoinDepositsEventsRepository',
  BitcoinDepositsEventsRepository,
);

container.registerSingleton<IUsersBitcoinWithdrawalsRepository>(
  'UsersBitcoinWithdrawalsRepository',
  UsersBitcoinWithdrawalsRepository,
);
