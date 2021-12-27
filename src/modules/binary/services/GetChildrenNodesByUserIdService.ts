import { inject, injectable } from 'tsyringe';

import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import IFindConnectedNodesByUserIdDTO from '../dtos/IFindConnectedNodesByUserIdDTO';
// import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IParams {
  user_id: string;
}

@injectable()
class GetConnectedNodesByUserIdService {
  constructor(
    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
  ) {}

  async execute({ user_id }: IParams): Promise<IFindConnectedNodesByUserIdDTO> {
    // const key = `binary_connected_nodes:${user_id}`;

    // let nodes =
    //   await this.cacheProvider.recover<IFindConnectedNodesByUserIdDTO>(key);

    // if (!nodes) {
    const nodes = await this.binariesNodesRepository.findConnectedNodesByUserId(
      user_id,
    );
    //   await this.cacheProvider.save(key, nodes);
    // }

    return nodes;
  }
}
export default GetConnectedNodesByUserIdService;
