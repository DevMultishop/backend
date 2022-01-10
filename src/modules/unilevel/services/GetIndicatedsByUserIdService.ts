import { inject, injectable } from 'tsyringe';

import IUnilevelNodesRepository from '../repositories/IUnilevelNodesRepository';
import UnilevelNode from '../infra/typeorm/entities/UnilevelNode';
import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IParams {
  user_id: string;
}

@injectable()
class GetIndicatedsByUserIdService {
  constructor(
    @inject('UnilevelNodesRepository')
    private unilevelNodesRepository: IUnilevelNodesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async execute({ user_id }: IParams): Promise<UnilevelNode[]> {
    const key = `user_unilevel:${user_id}`;
    let indicateds = await this.cacheProvider.recover<UnilevelNode[]>(key);

    if (!indicateds) {
      indicateds = await this.unilevelNodesRepository.findAllByIndicatorId(
        user_id,
      );
      await this.cacheProvider.save(key, indicateds);
    }
    return indicateds;
  }
}
export default GetIndicatedsByUserIdService;
