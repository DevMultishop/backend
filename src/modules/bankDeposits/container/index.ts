import { container } from 'tsyringe';
import BanksDepositsRepository from '../infra/typeorm/repositories/BanksDepositsRepository';
import IBanksDepositsRepository from '../repositories/IBanksDepositsRepository';

container.registerSingleton<IBanksDepositsRepository>(
  'BanksDepositsRepository',
  BanksDepositsRepository,
);
