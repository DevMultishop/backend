import ICreateUnilevelNodeDTO from '../../dots/ICreateUnilevelNodeDTO';
import UnilevelNode from '../../infra/typeorm/entities/UnilevelNode';
import IUnilevelNodesRepository from '../IUnilevelNodesRepository';

class FakeUnilevelNodesRepository implements IUnilevelNodesRepository {
  private nodes: UnilevelNode[] = [];

  public async create({
    user_id,
    indicator_id,
  }: ICreateUnilevelNodeDTO): Promise<UnilevelNode> {
    const node = new UnilevelNode();
    Object.assign(node, {
      user_id,
      indicator_id,
      created_at: new Date(),
    });
    this.nodes.push(node);
    return node;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<UnilevelNode | undefined> {
    return this.nodes.find(node => node.user_id === user_id);
  }

  public async findAllIndicateds(
  ): Promise<number > {
    return 2
  }

}
export default FakeUnilevelNodesRepository;
