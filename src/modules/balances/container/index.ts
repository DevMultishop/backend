import { container } from 'tsyringe';
import TransfersRepository from '../infra/typeorm/repositories/TransfersRepository';
import UsersBalancesRepository from '../infra/typeorm/repositories/UsersBalancesRepository';
import ITransfersRepository from '../repositories/ITransfersRepository';
import IUsersBalancesRepository from '../repositories/IUsersBalancesRepository';

container.registerSingleton<IUsersBalancesRepository>(
  'UsersBalancesRepository',
  UsersBalancesRepository,
);

container.registerSingleton<ITransfersRepository>(
  'TransfersRepository',
  TransfersRepository,
);
