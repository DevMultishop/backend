import { inject, injectable } from 'tsyringe';

import UserBinaryKey from '../infra/typeorm/entities/UserBinaryKey';
import IUsersBinaryKeysRepository from '../repositories/IUsersBinaryKeysRepository';

interface IParams {
  user_id: string;
  position: 'left' | 'right' | 'automatic';
}

@injectable()
class UpdateUserBinaryKeyService {
  constructor(
    @inject('UsersBinaryKeysRepository')
    private usersBinaryKeysRepository: IUsersBinaryKeysRepository,
  ) {}

  async execute({ user_id, position }: IParams): Promise<UserBinaryKey> {
    let binaryKey = await this.usersBinaryKeysRepository.findByUserId(user_id);

    if (!binaryKey)
      binaryKey = await this.usersBinaryKeysRepository.create(user_id);

    binaryKey.position = position;

    await this.usersBinaryKeysRepository.save(binaryKey);

    return binaryKey;
  }
}
export default UpdateUserBinaryKeyService;
