import { getRepository, Repository } from 'typeorm';
import IFindByHigherAndPositionDTO from '../../../dtos/IFindByHigherAndPositionDTO';
import IFindConnectedNodesByUserIdDTO from '../../../dtos/IFindConnectedNodesByUserIdDTO';
import IBinariesNodesRepository from '../../../repositories/IBinariesNodesRepository';
import ICreateBinaryNodeDTO from '../../../dtos/ICreateBinaryNodeDTO';
import BinaryNode from '../entities/BinaryNode';

class BinariesNodesRepository implements IBinariesNodesRepository {
  private ormRepository: Repository<BinaryNode>;

  constructor() {
    this.ormRepository = getRepository(BinaryNode);
  }

  public async findAll(): Promise<BinaryNode[]> {
    return this.ormRepository.find();
  }

  public async findConnectedNodesByUserId(
    user_id: string,
  ): Promise<IFindConnectedNodesByUserIdDTO> {
    const userNode = await this.ormRepository.findOne({
      where: { user_id },
      relations: ['user'],
    });
    if (!userNode) return {};

    const [higher, children] = await Promise.all([
      this.ormRepository.findOne({
        where: { id: userNode.higher_id },
        relations: ['user'],
      }),
      this.ormRepository.find({
        where: { higher_id: userNode.id },
        relations: ['user'],
      }),
    ]);

    return {
      higher,
      node: userNode,
      left: children.find(n => n.position === 'left'),
      right: children.find(n => n.position === 'right'),
    };
  }

  public async findByHigherAndPosition({
    higher_id,
    position,
  }: IFindByHigherAndPositionDTO): Promise<BinaryNode | undefined> {
    const finded = await this.ormRepository.findOne({
      where: {
        higher_id,
        position,
      },
    });
    return finded;
  }

  public async findByUserId(user_id: string): Promise<BinaryNode | undefined> {
    const finded = await this.ormRepository.findOne({
      where: { user_id },
    });
    return finded;
  }

  public async create({
    higher_id,
    position,
    user_id,
    depth,
  }: ICreateBinaryNodeDTO): Promise<BinaryNode> {
    const node = this.ormRepository.create({
      higher_id,
      position,
      user_id,
      depth,
    });

    await this.ormRepository.save(node);

    return node;
  }
}

export default BinariesNodesRepository;
