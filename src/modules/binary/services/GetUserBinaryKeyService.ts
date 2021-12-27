import { inject, injectable } from 'tsyringe';

import UserBinaryKey from '../infra/typeorm/entities/UserBinaryKey';
import IUsersBinaryKeysRepository from '../repositories/IUsersBinaryKeysRepository';

interface IParams {
  user_id: string;
}

@injectable()
class GetUserBinaryKeyService {
  constructor(
    @inject('UsersBinaryKeysRepository')
    private usersBinaryKeysRepository: IUsersBinaryKeysRepository,
  ) {}

  async execute({ user_id }: IParams): Promise<UserBinaryKey> {
    let binaryKey = await this.usersBinaryKeysRepository.findByUserId(user_id);

    if (!binaryKey)
      binaryKey = await this.usersBinaryKeysRepository.create(user_id);

    return binaryKey;
  }
}
export default GetUserBinaryKeyService;
