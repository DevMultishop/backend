import { inject, injectable } from 'tsyringe';
import app from '../../../config/app';

import IUsersRepository from '../repositories/IUsersRepository';

interface IParams {
  user_id: string;
}

@injectable()
class GetMyIndicationlinkService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IParams): Promise<string> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new Error('User not found');

    const link = `${app.frontend.host}/register/${user.username}`;
    return link;
  }
}
export default GetMyIndicationlinkService;
