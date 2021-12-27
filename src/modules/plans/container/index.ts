import { container } from 'tsyringe';
import PlansDailyIncomesRepository from '../infra/typeorm/repositories/PlansDailyIncomesRepository';
import PlansRepository from '../infra/typeorm/repositories/PlansRepository';
import UsersPlansRepository from '../infra/typeorm/repositories/UsersPlansRepository';
import IPlansDailyIncomesRepository from '../repositories/IPlansDailyIncomesRepository';
import IPlansRepository from '../repositories/IPlansRepository';
import IUsersPlansRepository from '../repositories/IUsersPlansRepository';

container.registerSingleton<IPlansRepository>(
  'PlansRepository',
  PlansRepository,
);

container.registerSingleton<IUsersPlansRepository>(
  'UsersPlansRepository',
  UsersPlansRepository,
);

container.registerSingleton<IPlansDailyIncomesRepository>(
  'PlansDailyIncomesRepository',
  PlansDailyIncomesRepository,
);
