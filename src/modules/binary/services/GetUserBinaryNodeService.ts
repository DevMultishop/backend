/* eslint-disable no-nested-ternary */
import { inject, injectable } from 'tsyringe';

import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import BinaryNode from '../infra/typeorm/entities/BinaryNode';

interface IParams {
  user_id: string;
}

@injectable()
class GetUserBinaryNodeService {
  constructor(
    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository,
  ) {}

  async execute({ user_id }: IParams): Promise<BinaryNode | undefined> {
    const node = await this.binariesNodesRepository.findByUserId(user_id);
    return node;
  }
}
export default GetUserBinaryNodeService;
