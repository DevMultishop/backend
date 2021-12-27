import { container } from 'tsyringe';
import BinariesNodesRepository from '../infra/typeorm/repositories/BinariesNodesRepository';
import UsersBinaryKeysRepository from '../infra/typeorm/repositories/UsersBinaryKeysRepository';
import UsersBinaryPointsRepository from '../infra/typeorm/repositories/UsersBinaryPointsRepository';
import UsersBinaryStatusRepository from '../infra/typeorm/repositories/UsersBinaryStatusRepository';
import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import IUsersBinaryKeysRepository from '../repositories/IUsersBinaryKeysRepository';
import IUsersBinaryPointsRepository from '../repositories/IUsersBinaryPointsRepository';
import IUsersBinaryStatusRepository from '../repositories/IUsersBinaryStatusRepository';

container.registerSingleton<IBinariesNodesRepository>(
  'BinariesNodesRepository',
  BinariesNodesRepository,
);

container.registerSingleton<IUsersBinaryKeysRepository>(
  'UsersBinaryKeysRepository',
  UsersBinaryKeysRepository,
);

container.registerSingleton<IUsersBinaryPointsRepository>(
  'UsersBinaryPointsRepository',
  UsersBinaryPointsRepository,
);

container.registerSingleton<IUsersBinaryStatusRepository>(
  'UsersBinaryStatusRepository',
  UsersBinaryStatusRepository,
);
