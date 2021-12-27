import { inject, injectable } from 'tsyringe';
import IBinariesNodesRepository from '../../binary/repositories/IBinariesNodesRepository';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class GetIndicatorService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository,
  ) {}

  public async execute(username: string): Promise<User> {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) throw new Error('Indicator not found');

    const userNode = await this.binariesNodesRepository.findByUserId(user.id);
    if (!userNode) throw new Error('Invalid indicator');
    // const indicatorNode = await this.unilevelNodesRepository.findByUserId(
    //   user.id,
    // );
    // if (!indicatorNode) throw new Error('Indicador nao possui rede unilevel');
    return user;
  }
}
export default GetIndicatorService;
