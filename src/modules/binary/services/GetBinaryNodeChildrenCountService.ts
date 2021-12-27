import { inject, injectable } from 'tsyringe';

import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import BinaryNode from '../infra/typeorm/entities/BinaryNode';
// import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IParams {
  node_id: string;
}

interface INodesCount {
  [key: string]: number;
}

@injectable()
class GetBinaryNodeChildrenCountService {
  constructor(
    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
  ) {}

  async execute({ node_id }: IParams): Promise<number> {
    // const key = `binary_nodes_children_count`;

    // let nodesCount = await this.cacheProvider.recover<INodesCount>(key);

    // if (!nodesCount) {
    const allNodes = await this.binariesNodesRepository.findAll();

    const createUplinesBranch = (
      higher_id: string,
      branch: BinaryNode[],
    ): BinaryNode[] => {
      const higher = allNodes.find(node => node.id === higher_id);
      if (higher) {
        branch.push(higher);
      }
      return higher && higher.higher_id
        ? createUplinesBranch(higher.higher_id, branch)
        : branch;
    };

    const nodesCount = allNodes.reduce((acc, curr) => {
      if (!curr.higher_id) return acc;
      const uplines = createUplinesBranch(curr.higher_id, []);

      uplines.forEach(upline => {
        if (!acc[upline.id]) acc[upline.id] = 0;
        acc[upline.id] += 1;
      });

      return acc;
    }, {} as INodesCount);

    // await this.cacheProvider.save(key, nodesCount);
    // }

    return nodesCount[node_id] || 0;
  }
}
export default GetBinaryNodeChildrenCountService;
