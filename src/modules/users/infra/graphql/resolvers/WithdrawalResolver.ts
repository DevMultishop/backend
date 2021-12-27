import {
  Resolver,
  UseMiddleware,
  Query,
  Mutation,
  Ctx,
  Arg,
} from 'type-graphql';
import { container } from 'tsyringe';
import CheckWithdrawalOpenService from '../../../../bitcoin/services/CheckWithdrawalOpenService';
import GetUserBitcoinWithdrawalByMonthService from '../../../../bitcoin/services/GetUserBitcoinWithdrawalByMonthService';
import CreateUserBitcoinWithdrawalService from '../../../../bitcoin/services/CreateUserBitcoinWithdrawalService';
import GetUserBitcoinWalletService from '../../../services/GetUserBitcoinWalletService';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import VerifyFinancialPasswordService from '../../../services/VerifyFinancialPasswordService';
import UserBitcoinWithdrawal from '../../../../bitcoin/infra/typeorm/entities/UserBitcoinWithdrawal';

@Resolver()
class WithdrawalResolver {
  @Query(() => Boolean)
  @UseMiddleware(EnsureIsUser)
  async getHasBitcoinWallet(@Ctx('user_id') user_id: string): Promise<boolean> {
    return !!(await container
      .resolve(GetUserBitcoinWalletService)
      .execute({ user_id }));
  }

  @Query(() => Boolean)
  @UseMiddleware(EnsureIsUser)
  async getIsWithdrawalOpen(): Promise<boolean> {
    return container.resolve(CheckWithdrawalOpenService).execute();
  }

  @Query(() => String)
  async getMyBitcoinWallet(@Ctx('user_id') user_id: string): Promise<string> {
    return (
      (
        await container
          .resolve(GetUserBitcoinWalletService)
          .execute({ user_id })
      )?.address || ''
    );
  }

  @Query(() => [UserBitcoinWithdrawal])
  @UseMiddleware(EnsureIsUser)
  async getMyWithdrawalStatment(
    @Ctx('user_id') user_id: string,
    @Arg('month') month: number,
    @Arg('year') year: number,
  ): Promise<UserBitcoinWithdrawal[]> {
    return container
      .resolve(GetUserBitcoinWithdrawalByMonthService)
      .execute({ year, month, user_id });
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async createBitcoinWithdrawal(
    @Ctx('user_id') user_id: string,
    @Arg('usd_value') usd_value: number,
    @Arg('financial_password') financial_password: string,
  ): Promise<string> {
    const isOpen = await container
      .resolve(CheckWithdrawalOpenService)
      .execute();

    if (!isOpen) throw new Error('Withdrawals are closed');

    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });

    await container
      .resolve(CreateUserBitcoinWithdrawalService)
      .execute({ user_id, usd_value });

    return 'Withdrawal successfully created, check your statement for confirmation';
  }
}
export default WithdrawalResolver;
