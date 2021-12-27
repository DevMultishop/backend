import { container } from 'tsyringe';
import {
  Resolver,
  UseMiddleware,
  Ctx,
  Arg,
  Query,
  Mutation,
} from 'type-graphql';
import GetUsersBinaryPointsService from '../../../../binary/services/GetUserBinaryPointsByDayService';
import GetDailyResultsByMonthService from '../../../../binary/services/GetDailyResultsByMonthService';
import UserBinaryPoint from '../../../../binary/infra/typeorm/entities/UserBinaryPoint';
import UserBinaryStatus from '../../../../binary/infra/typeorm/entities/UserBinaryStatus';
import UpdateUserBinaryKeyService from '../../../../binary/services/UpdateUserBinaryKeyService';
import GetUserBinaryKeyService from '../../../../binary/services/GetUserBinaryKeyService';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import GetConnectedNodesByUserIdService from '../../../../binary/services/GetChildrenNodesByUserIdService';
import UserBinaryKey from '../../../../binary/infra/typeorm/entities/UserBinaryKey';
import GetUserPlanNameService from '../../../../plans/services/GetUserPlanNameService';

interface INode {
  name: string;
  phone_number: string;
  id: string;
  plan: string;
  line_number: number;
  children: INode[];
}

@Resolver()
class BinaryResolver {
  @Query(() => String)
  @UseMiddleware(EnsureIsUser)
  async getBinaryTree(
    @Ctx('user_id') user_id: string,
    @Arg('going_up') going_up: boolean,
    @Arg('clicked_user_id', { nullable: true }) clicked_user_id?: string,
  ): Promise<string> {
    const getConnectedNodesByUserIdService = container.resolve(
      GetConnectedNodesByUserIdService,
    );
    const [clickedUserNode, userNode] = await Promise.all([
      getConnectedNodesByUserIdService.execute({
        user_id: clicked_user_id || user_id,
      }),
      getConnectedNodesByUserIdService.execute({
        user_id,
      }),
    ]);
    if (!clickedUserNode.node || !userNode.node)
      throw new Error('Você não está na rede binária');

    let rootNode = clickedUserNode;
    if (going_up && clickedUserNode.higher) {
      rootNode = await getConnectedNodesByUserIdService.execute({
        user_id: clickedUserNode.higher.user_id,
      });
    }
    if (!rootNode.node) throw new Error('Você não está na rede binária');

    const line1 = rootNode.node.depth - userNode.node.depth;
    const isAboveUser = line1 < 0;
    if (isAboveUser) throw new Error('Você ja esta no topo');

    const a = rootNode.node.user;

    const getUserPlanNameService = container.resolve(GetUserPlanNameService);

    const result: INode = {
      name: a.username,
      phone_number: a.phone_number,
      plan: await getUserPlanNameService.execute({ user_id: a.id }),
      id: a.id,
      line_number: line1,
      children: [],
    };

    const b = rootNode.left?.user;
    const c = rootNode.right?.user;

    result.children.push({} as INode);
    result.children.push({} as INode);

    if (b) {
      result.children[0] = {
        name: b.username,
        phone_number: b.phone_number,
        plan: await getUserPlanNameService.execute({ user_id: b.id }),
        line_number: line1 + 1,
        id: b.id,
        children: [],
      };
    }
    if (c) {
      result.children[1] = {
        name: c.username,
        phone_number: c.phone_number,
        plan: await getUserPlanNameService.execute({ user_id: c.id }),
        line_number: line1 + 1,
        id: c.id,
        children: [],
      };
    }

    let d;
    let e;

    if (b) {
      result.children[0].children.push({} as INode);
      result.children[0].children.push({} as INode);
      const bNode = await getConnectedNodesByUserIdService.execute({
        user_id: b.id,
      });
      d = bNode.left?.user;
      e = bNode.right?.user;
    }

    if (d) {
      result.children[0].children[0] = {
        name: d.username,
        phone_number: d.phone_number,
        plan: await getUserPlanNameService.execute({ user_id: d.id }),
        id: d.id,
        line_number: line1 + 2,
        children: [],
      };
    }

    if (e) {
      result.children[0].children[1] = {
        name: e.username,
        phone_number: e.phone_number,
        plan: await getUserPlanNameService.execute({ user_id: e.id }),
        id: e.id,
        line_number: line1 + 2,
        children: [],
      };
    }

    let f;
    let g;

    if (c) {
      result.children[1].children.push({} as INode);
      result.children[1].children.push({} as INode);
      const cNode = await getConnectedNodesByUserIdService.execute({
        user_id: c.id,
      });
      f = cNode.left?.user;
      g = cNode.right?.user;
    }

    if (f) {
      result.children[1].children[0] = {
        name: f.username,
        phone_number: f.phone_number,
        plan: await getUserPlanNameService.execute({ user_id: f.id }),
        id: f.id,
        line_number: line1 + 2,
        children: [],
      };
    }

    if (g) {
      result.children[1].children[1] = {
        name: g.username,
        phone_number: g.phone_number,
        plan: await getUserPlanNameService.execute({ user_id: g.id }),
        id: g.id,
        line_number: line1 + 2,
        children: [],
      };
    }

    return JSON.stringify(result);
  }

  @Query(() => UserBinaryKey)
  @UseMiddleware(EnsureIsUser)
  async getMyBinaryKey(
    @Ctx('user_id') user_id: string,
  ): Promise<UserBinaryKey> {
    return container.resolve(GetUserBinaryKeyService).execute({ user_id });
  }

  @Mutation(() => UserBinaryKey)
  @UseMiddleware(EnsureIsUser)
  async updateMyBinaryKey(
    @Ctx('user_id') user_id: string,
    @Arg('position') position: 'left' | 'right' | 'automatic',
  ): Promise<UserBinaryKey> {
    return container
      .resolve(UpdateUserBinaryKeyService)
      .execute({ user_id, position });
  }

  @Query(() => [UserBinaryPoint])
  @UseMiddleware(EnsureIsUser)
  async getTodayBinaryPoints(
    @Ctx('user_id') user_id: string,
  ): Promise<UserBinaryPoint[]> {
    return container
      .resolve(GetUsersBinaryPointsService)
      .execute({ user_id, day: new Date() });
  }

  @Query(() => [UserBinaryStatus])
  @UseMiddleware(EnsureIsUser)
  async getBinaryDailyResults(
    @Ctx('user_id') user_id: string,
    @Arg('month') month: number,
    @Arg('year') year: number,
  ): Promise<UserBinaryStatus[]> {
    return container
      .resolve(GetDailyResultsByMonthService)
      .execute({ user_id, month, year });
  }
}
export default BinaryResolver;
