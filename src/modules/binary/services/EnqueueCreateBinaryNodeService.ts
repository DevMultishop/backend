import { inject, injectable } from 'tsyringe';

import BinaryNode from '../infra/typeorm/entities/BinaryNode';
import IQueue from '../../../shared/container/providers/QueueProvider/models/IQueue';

interface IParams {
  user_id: string;
}

@injectable()
class EnqueueCreateBinaryNodeService {
  constructor(
    @inject('CreateBinaryNodeQueue')
    private createBinaryNodeQueue: IQueue,
  ) {}

  async execute({ user_id }: IParams): Promise<BinaryNode> {
    const node = await this.createBinaryNodeQueue.add<BinaryNode | undefined>({
      user_id,
    });
    if (!node) throw new Error('Error on creating binary node');
    return node;
  }
}
export default EnqueueCreateBinaryNodeService;
