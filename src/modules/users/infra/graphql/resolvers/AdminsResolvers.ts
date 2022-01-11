import { container } from 'tsyringe';
import {
  Resolver,
  UseMiddleware,
  Arg,
  Query,
  Mutation,
  Ctx,
} from 'type-graphql';
import GetAllBitcoinWithdrawalByMonthService from '../../../../bitcoin/services/GetAllBitcoinWithdrawalByMonthService';
import GetCardBalanceSumService from '../../../../balances/services/GetCardBalanceSumService';
import CreateUserManualBalanceService from '../../../../balances/services/CreateUserManualBalanceService';
import UpdateDailyIncomeService from '../../../../plans/services/UpdateDailyIncomeService';
import GetPlanDailyIncomesByMonthService from '../../../../plans/services/GetPlanDailyIncomesByMonthService';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import EnsureIsAdmin from '../middlewares/EnsureIsAdmin';
import PlanDailyIncome from '../../../../plans/infra/typeorm/entities/PlanDailyIncome';
import UserBitcoinWithdrawal from '../../../../bitcoin/infra/typeorm/entities/UserBitcoinWithdrawal';
import GetUsersPendingWithdrawalsService from '../../../../bitcoin/services/GetUsersPendingWithdrawalsService';
import EnqueueProcessBitcoinWithdrawalQueue from '../../../../bitcoin/services/EnqueueProcessBitcoinWithdrawalQueue';
import VerifyFinancialPasswordService from '../../../services/VerifyFinancialPasswordService';
import UsersSelectOptions from '../type/UsersSelectOptions';
import GetAllUsersSelectOptionsService from '../../../services/GetAllUsersSelectOptionsService';
import Transfer from '../../../../balances/infra/typeorm/entities/Transfer';
import GetAllUsersmanualBalancesByMonthService from '../../../../balances/services/GetAllUsersmanualBalancesByMonthService';
import GetPayedWithdrawalsService from '../../../../bitcoin/services/GetPayedWithdrawalsService';
import CreateIndicationBonusService from '../../../../unilevel/services/CreateIndicationBonusService';
import EnqueueUserPlanGainService from '../../../../plans/services/EnqueueUserPlanGainService';

@Resolver()
class AdminsResolver {
  @Query(() => [PlanDailyIncome])
  @UseMiddleware(EnsureIsUser)
  @UseMiddleware(EnsureIsAdmin)
  async getMonthlyIncomes(
    @Arg('month') month: number,
    @Arg('year') year: number,
  ): Promise<PlanDailyIncome[]> {
    return container
      .resolve(GetPlanDailyIncomesByMonthService)
      .execute({ month, year });
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  @UseMiddleware(EnsureIsAdmin)
  async updateDailyIncome(
    @Arg('income_id') income_id: string,
    @Arg('value') value: string,
  ): Promise<string> {
    await container.resolve(UpdateDailyIncomeService).execute(income_id, value);
    return 'Sucessfuly updated';
  }

  @Query(() => [UserBitcoinWithdrawal])
  @UseMiddleware(EnsureIsUser)
  @UseMiddleware(EnsureIsAdmin)
  async getUsersPendingWithdrawals(): Promise<UserBitcoinWithdrawal[]> {
    return container.resolve(GetUsersPendingWithdrawalsService).execute();
  }

  @Query(() => [UsersSelectOptions])
  @UseMiddleware(EnsureIsUser)
  @UseMiddleware(EnsureIsAdmin)
  async getUsersSelectOptions(): Promise<UsersSelectOptions[]> {
    return container.resolve(GetAllUsersSelectOptionsService).execute();
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsAdmin)
  async createUserManualBalance(
    @Ctx('user_id') user_id: string,
    @Arg('target_user_id') target_user_id: string,
    @Arg('usd_value') usd_value: number,
    @Arg('financial_password') financial_password: string,
  ): Promise<string> {
    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });

    await container
      .resolve(CreateUserManualBalanceService)
      .execute({ user_id: target_user_id, usd_cents: Number(usd_value) * 100 });

    return 'Sucess';
  }

  @Query(() => [Transfer])
  @UseMiddleware(EnsureIsUser)
  @UseMiddleware(EnsureIsAdmin)
  async getMonthlyManualBalances(
    @Arg('month') month: number,
    @Arg('year') year: number,
  ): Promise<Transfer[]> {
    return container
      .resolve(GetAllUsersmanualBalancesByMonthService)
      .execute({ month, year });
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsAdmin)
  async processUsersBitcoinWithdrawal(
    @Ctx('user_id') user_id: string,
    @Arg('ids') ids: string,
    @Arg('financial_password') financial_password: string,
  ): Promise<string> {
    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });

    const enqueueProcessBitcoinWithdrawalQueue = container.resolve(
      EnqueueProcessBitcoinWithdrawalQueue,
    );

    await enqueueProcessBitcoinWithdrawalQueue.execute(
      JSON.parse(ids) as string[],
    );

    const paiedsWithdrawals = await container
      .resolve(GetPayedWithdrawalsService)
      .execute(JSON.parse(ids) as string[]);

    const bonus = await Promise.all(
      paiedsWithdrawals.map(async w => {
        const withdrawalBonus = await container
          .resolve(CreateIndicationBonusService)
          .execute({ usd_cents: w.usd_cents, user_id: w.user_id });
        return withdrawalBonus;
      }),
    );

    await Promise.all(
      bonus.map(b => container.resolve(EnqueueUserPlanGainService).execute(b)),
    );

    return 'Sucess';
  }

  @Query(() => String)
  @UseMiddleware(EnsureIsUser)
  async getCardBalanceSum(
    @Arg('card') card: 'credit' | 'available',
  ): Promise<string> {
    return container.resolve(GetCardBalanceSumService).execute({ card });
  }

  @Query(() => [UserBitcoinWithdrawal])
  @UseMiddleware(EnsureIsUser)
  @UseMiddleware(EnsureIsAdmin)
  async getMonthlyProcessedWithdrawals(
    @Arg('month') month: number,
    @Arg('year') year: number,
  ): Promise<UserBitcoinWithdrawal[]> {
    return container
      .resolve(GetAllBitcoinWithdrawalByMonthService)
      .execute({ month, year });
  }
}
export default AdminsResolver;
