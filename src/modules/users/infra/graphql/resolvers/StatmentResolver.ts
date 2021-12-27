import { container } from 'tsyringe';
import { Resolver, UseMiddleware, Query, Ctx, Arg } from 'type-graphql';
import GetUserStatmentByMonthService from '../../../../balances/services/GetUserStatmentByMonthService';
import Transfer from '../../../../balances/infra/typeorm/entities/Transfer';
import EnsureIsUser from '../middlewares/EnsureIsUser';

@Resolver()
class StatmentResolver {
  @Query(() => [Transfer])
  @UseMiddleware(EnsureIsUser)
  async getMyStatment(
    @Ctx('user_id') user_id: string,
    @Arg('month') month: number,
    @Arg('year') year: number,
    @Arg('card') card: 'credit' | 'available' | 'income' | 'applied',
  ): Promise<Transfer[]> {
    return container
      .resolve(GetUserStatmentByMonthService)
      .execute({ month, year, user_id, card });
  }
}
export default StatmentResolver;
