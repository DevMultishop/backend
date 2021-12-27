import { inject, injectable } from 'tsyringe';

import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import BinaryNode from '../infra/typeorm/entities/BinaryNode';
// import IFindConnectedNodesByUserIdDTO from '../dtos/IFindConnectedNodesByUserIdDTO';
// import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IParams {
  user_id: string;
}

@injectable()
class GetBinaryUplinesService {
  constructor(
    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
  ) {}

  async execute({ user_id }: IParams): Promise<BinaryNode[]> {
    const createBinaryBranch = async (
      userId: string,
      nodes: BinaryNode[],
    ): Promise<BinaryNode[]> => {
      // let connectedNodes =
      //   await this.cacheProvider.recover<IFindConnectedNodesByUserIdDTO>(
      //     `binary_connected_nodes:${userId}`,
      //   );

      // if (!connectedNodes) {
      const connectedNodes =
        await this.binariesNodesRepository.findConnectedNodesByUserId(userId);
      // await this.cacheProvider.save(
      //   `binary_connected_nodes:${userId}`,
      //   connectedNodes,
      // );
      // }
      if (connectedNodes.higher && connectedNodes.higher.user_id) {
        nodes.push(connectedNodes.higher);
        return createBinaryBranch(connectedNodes.higher.user_id, nodes);
      }
      return nodes;
    };

    return createBinaryBranch(user_id, []);
  }
}
export default GetBinaryUplinesService;
