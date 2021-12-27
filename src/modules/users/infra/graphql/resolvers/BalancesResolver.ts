import { container } from 'tsyringe';
import { Resolver, UseMiddleware, Ctx, Arg, Query } from 'type-graphql';
import GetUserCardBalanceService from '../../../../balances/services/GetUserCardBalanceService';
import UserBalance from '../../../../balances/infra/typeorm/entities/UserBalance';
import EnsureIsUser from '../middlewares/EnsureIsUser';

@Resolver()
class BalancesResolver {
  @Query(() => UserBalance)
  @UseMiddleware(EnsureIsUser)
  async getMyBalanceCard(
    @Ctx('user_id') user_id: string,
    @Arg('card') card: 'credit' | 'available',
  ): Promise<UserBalance> {
    return container
      .resolve(GetUserCardBalanceService)
      .execute({ user_id, card });
  }
}
export default BalancesResolver;
