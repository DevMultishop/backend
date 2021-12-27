import { container } from 'tsyringe';
import UnilevelNodesRepository from '../infra/typeorm/repositories/UnilevelNodesRepository';
import IUnilevelNodesRepository from '../repositories/IUnilevelNodesRepository';

container.registerSingleton<IUnilevelNodesRepository>(
  'UnilevelNodesRepository',
  UnilevelNodesRepository,
);
