import { v4 } from 'uuid';
import IFindConnectedNodesByUserIdDTO from '../../dtos/IFindConnectedNodesByUserIdDTO';
import BinaryNode from '../../infra/typeorm/entities/BinaryNode';
import IFindByHigherAndPositionDTO from '../../dtos/IFindByHigherAndPositionDTO';
import ICreateBinaryNodeDTO from '../../dtos/ICreateBinaryNodeDTO';

import IBinariesNodesRepository from '../IBinariesNodesRepository';

class FakeBinariesNodesRepository implements IBinariesNodesRepository {
  private nodes: BinaryNode[] = [];

  public async findByHigherAndPosition({
    position,
    higher_id,
  }: IFindByHigherAndPositionDTO): Promise<BinaryNode | undefined> {
    const finded = this.nodes.find(
      node => node.higher_id === higher_id && node.position === position,
    );
    return finded;
  }

  public async findConnectedNodesByUserId(
    user_id: string,
  ): Promise<IFindConnectedNodesByUserIdDTO> {
    const userNode = this.nodes.find(n => n.user_id === user_id);
    if (!userNode) return {};

    const higher = this.nodes.find(n => n.id === userNode.higher_id);
    const children = this.nodes.filter(n => n.higher_id === userNode.id);

    return {
      higher,
      node: userNode,
      left: children.find(n => n.position === 'left'),
      right: children.find(n => n.position === 'right'),
    };
  }

  public async findByUserId(user_id: string): Promise<BinaryNode | undefined> {
    const finded = this.nodes.find(node => node.user_id === user_id);
    return finded;
  }

  public async findAll(): Promise<BinaryNode[]> {
    return this.nodes;
  }

  public async create({
    higher_id,
    position,
    user_id,
  }: ICreateBinaryNodeDTO): Promise<BinaryNode> {
    const node = new BinaryNode();
    Object.assign(node, {
      id: v4(),
      higher_id,
      position,
      user_id,
    });
    this.nodes.push(node);
    return node;
  }
}

export default FakeBinariesNodesRepository;
