import { container } from 'tsyringe';
import { Resolver, UseMiddleware, Ctx, Mutation, Arg } from 'type-graphql';
import UserBitcoinDepositEvent from '../../../../bitcoin/infra/typeorm/entities/UserBitcoinDepositEvent';
import CreateUserBitcoinDepositEventService from '../../../../bitcoin/services/CreateUserDepositEventService';
import EnsureIsUser from '../middlewares/EnsureIsUser';

@Resolver()
class BitcoinResolver {
  @Mutation(() => UserBitcoinDepositEvent)
  @UseMiddleware(EnsureIsUser)
  async createBitcoinDeposit(
    @Ctx('user_id') user_id: string,
    @Arg('usd_value') usd_value: number,
  ): Promise<UserBitcoinDepositEvent> {
    const createUserBitcoinDepositEvent = container.resolve(
      CreateUserBitcoinDepositEventService,
    );
    return createUserBitcoinDepositEvent.execute(user_id, usd_value);
  }
}
export default BitcoinResolver;
