import { container } from 'tsyringe';
import { Resolver, UseMiddleware, Query, Arg, Ctx } from 'type-graphql';
import GetIndicatedsByUserIdService from '../../../../unilevel/services/GetIndicatedsByUserIdService';

import UnilevelNode from '../../../../unilevel/infra/typeorm/entities/UnilevelNode';
import EnsureIsUser from '../middlewares/EnsureIsUser';

@Resolver()
export default class UnilevelResolver {
  @Query(() => [UnilevelNode])
  @UseMiddleware(EnsureIsUser)
  async getUnilevelByUserId(
    @Arg('user_id', { nullable: true }) target_user_id: string,
    @Ctx('user_id') user_id: string,
  ): Promise<UnilevelNode[]> {
    const getIndicatedsByUserIdService = container.resolve(
      GetIndicatedsByUserIdService,
    );
    return getIndicatedsByUserIdService.execute({
      user_id: target_user_id || user_id,
    });
  }
}
