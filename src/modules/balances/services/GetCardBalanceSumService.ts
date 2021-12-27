import { inject, injectable } from 'tsyringe';
import { FormatUSD } from '../infra/typeorm/entities/UserBalance';
import IUsersBalancesRepository from '../repositories/IUsersBalancesRepository';

interface IParams {
  card: 'credit' | 'available';
}

@injectable()
class GetCardBalanceSumService {
  constructor(
    @inject('UsersBalancesRepository')
    private usersBalancesRepository: IUsersBalancesRepository,
  ) {}

  public async execute({ card }: IParams): Promise<string> {
    const balance = await this.usersBalancesRepository.sumBalanceByCard(card);

    return FormatUSD(balance * 0.01);
  }
}
export default GetCardBalanceSumService;
