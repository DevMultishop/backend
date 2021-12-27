import { inject, injectable } from 'tsyringe';
import UserBalance from '../infra/typeorm/entities/UserBalance';
import IUsersBalancesRepository from '../repositories/IUsersBalancesRepository';

interface IParams {
  user_id: string;
  card: 'credit' | 'available';
}

@injectable()
class GetUserCardBalanceService {
  constructor(
    @inject('UsersBalancesRepository')
    private usersBalancesRepository: IUsersBalancesRepository,
  ) {}

  public async execute({ user_id, card }: IParams): Promise<UserBalance> {
    let balance = await this.usersBalancesRepository.findByUserIdAndCard({
      card,
      user_id,
    });
    if (!balance)
      balance = await this.usersBalancesRepository.create({ card, user_id });

    return balance;
  }
}
export default GetUserCardBalanceService;
