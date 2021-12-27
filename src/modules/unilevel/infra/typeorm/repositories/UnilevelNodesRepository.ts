import { getRepository } from 'typeorm';
import ICreateUnilevelNodeDTO from '../../../dots/ICreateUnilevelNodeDTO';
import IUnilevelNodesRepository from '../../../repositories/IUnilevelNodesRepository';
import UnilevelNode from '../entities/UnilevelNode';

class UnilevelNodesRepository implements IUnilevelNodesRepository {
  constructor(private ormRepository = getRepository(UnilevelNode)) {}

  public async create({
    user_id,
    indicator_id,
  }: ICreateUnilevelNodeDTO): Promise<UnilevelNode> {
    const node = this.ormRepository.create({
      indicator_id,
      user_id,
    });
    await this.ormRepository.save(node);
    return node;
  }

  public async findByUserId(
    user_id: string,
  ): Promise<UnilevelNode | undefined> {
    return this.ormRepository.findOne({ where: { user_id } });
  }
}
export default UnilevelNodesRepository;
