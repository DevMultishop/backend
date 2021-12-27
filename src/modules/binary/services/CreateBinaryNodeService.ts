/* eslint-disable no-nested-ternary */
import { inject, injectable } from 'tsyringe';

import IUnilevelNodesRepository from '../../unilevel/repositories/IUnilevelNodesRepository';
import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import BinaryNode from '../infra/typeorm/entities/BinaryNode';
import IUsersBinaryKeysRepository from '../repositories/IUsersBinaryKeysRepository';
// import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';

interface IParams {
  user_id: string;
}

@injectable()
class CreateBinaryNodeService {
  constructor(
    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository,

    @inject('UnilevelNodesRepository')
    private unilevelNodesRepository: IUnilevelNodesRepository,

    // @inject('CacheProvider')
    // private cacheProvider: ICacheProvider,

    @inject('UsersBinaryKeysRepository')
    private usersBinaryKeysRepository: IUsersBinaryKeysRepository,
  ) {}

  async execute({ user_id }: IParams): Promise<BinaryNode> {
    const alreadyHasNode = await this.binariesNodesRepository.findByUserId(
      user_id,
    );
    if (alreadyHasNode) return alreadyHasNode;

    const userUnilevelNode = await this.unilevelNodesRepository.findByUserId(
      user_id,
    );
    const indicator_id = userUnilevelNode && userUnilevelNode.indicator_id;
    if (!indicator_id) throw new Error('Indicator not found');

    const indicatorNode = await this.binariesNodesRepository.findByUserId(
      indicator_id,
    );
    if (!indicatorNode) throw new Error('Indicator is not in binary tree');

    const nodes = await this.binariesNodesRepository.findAll();

    const createBranch = (
      branch: BinaryNode[],
      position: 'left' | 'right',
    ): BinaryNode[] => {
      const node = branch[branch.length - 1];
      const lower = nodes.find(
        n => n.position === position && n.higher_id === node.id,
      );
      if (lower) branch.push(lower);
      return lower ? createBranch(branch, position) : branch;
    };

    const leftBranch = createBranch([indicatorNode], 'left');
    const rightBranch = createBranch([indicatorNode], 'right');

    const leftBranchLength = leftBranch.length;
    const rightBranchLength = rightBranch.length;

    let indicator_binary_key =
      await this.usersBinaryKeysRepository.findByUserId(indicator_id);
    if (!indicator_binary_key)
      indicator_binary_key = await this.usersBinaryKeysRepository.create(
        indicator_id,
      );

    const branch =
      indicator_binary_key.position === 'left'
        ? leftBranch
        : indicator_binary_key.position === 'right'
        ? rightBranch
        : rightBranchLength < leftBranchLength
        ? rightBranch
        : leftBranch;

    const higher = branch[branch.length - 1];

    const position =
      indicator_binary_key.position === 'left'
        ? 'left'
        : indicator_binary_key.position === 'right'
        ? 'right'
        : higher.id !== indicatorNode.id
        ? higher.position
        : rightBranchLength < leftBranchLength
        ? 'right'
        : 'left';

    const node = await this.binariesNodesRepository.create({
      user_id,
      higher_id: higher.id,
      position,
      depth: higher.depth + 1,
    });

    // const key = `binary_connected_nodes:${higher.user_id}`;
    // await this.cacheProvider.invalidate(key);
    // await this.cacheProvider.invalidate(`binary_nodes_children_count`);

    return node;
  }
}
export default CreateBinaryNodeService;
