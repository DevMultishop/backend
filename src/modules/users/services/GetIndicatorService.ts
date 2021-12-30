import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class GetIndicatorService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(username: string): Promise<User> {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) throw new Error('Indicator not found');

    // const indicatorNode = await this.unilevelNodesRepository.findByUserId(
    //   user.id,
    // );
    // if (!indicatorNode) throw new Error('Indicador nao possui rede unilevel');
    return user;
  }
}
export default GetIndicatorService;
