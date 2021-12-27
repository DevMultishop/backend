import { inject, injectable } from 'tsyringe';
import UnilevelNode from '../infra/typeorm/entities/UnilevelNode';
import IUnilevelNodesRepository from '../repositories/IUnilevelNodesRepository';

interface IParams {
  user_id: string;
  indicator_id: string;
}

@injectable()
class CreateUnilevelNodeService {
  constructor(
    @inject('UnilevelNodesRepository')
    private unilevelNodesRepository: IUnilevelNodesRepository,
  ) {}

  public async execute({
    indicator_id,
    user_id,
  }: IParams): Promise<UnilevelNode> {
    const alreadyExists = await this.unilevelNodesRepository.findByUserId(
      user_id,
    );
    if (alreadyExists) throw new Error('User already has unilevel node');
    const node = await this.unilevelNodesRepository.create({
      indicator_id,
      user_id,
    });

    return node;
  }
}
export default CreateUnilevelNodeService;
