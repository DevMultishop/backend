import { container } from 'tsyringe';
import {
  Resolver,
  UseMiddleware,
  Query,
  Mutation,
  Arg,
  Ctx,
} from 'type-graphql';
import CreateUsersBinaryPointsService from '../../../../binary/services/CreateUsersBinaryPointsService';
import CreateIndicationBonusService from '../../../../unilevel/services/CreateIndicationBonusService';
import CreateUserPlanService from '../../../../plans/services/CreateUserPlanService';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import GetAllPlansService from '../../../../plans/services/GetAllPlansService';
import Plan from '../../../../plans/infra/typeorm/entities/Plan';
import VerifyFinancialPasswordService from '../../../services/VerifyFinancialPasswordService';
import EnqueueUserPlanGainService from '../../../../plans/services/EnqueueUserPlanGainService';
import EnqueueCreateBinaryNodeService from '../../../../binary/services/EnqueueCreateBinaryNodeService';

@Resolver()
class PlansResolver {
  @Query(() => [Plan])
  @UseMiddleware(EnsureIsUser)
  async getPlans(): Promise<Plan[]> {
    return container.resolve(GetAllPlansService).execute();
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async createMyPlan(
    @Arg('plan_id') plan_id: string,
    @Arg('financial_password') financial_password: string,
    @Ctx('user_id') user_id: string,
  ): Promise<string> {
    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });

    const usd_cents = await container
      .resolve(CreateUserPlanService)
      .execute({ user_id, plan_id });

    const bonus = await container
      .resolve(CreateIndicationBonusService)
      .execute({ user_id, usd_cents });

    await container.resolve(EnqueueUserPlanGainService).execute(bonus);

    const userNode = await container
      .resolve(EnqueueCreateBinaryNodeService)
      .execute({ user_id });

    await container
      .resolve(CreateUsersBinaryPointsService)
      .execute({ from_user_id: user_id, usd_cents, userNode, plan_id });

    return 'Successfully purchased plan';
  }
}
export default PlansResolver;
