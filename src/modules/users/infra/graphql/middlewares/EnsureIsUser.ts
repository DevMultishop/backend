import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';

import { MyContext } from '../../../../../shared/infra/graphql/Context';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

export default class EnsureIsUser implements MiddlewareInterface<MyContext> {
  async use(
    { context }: ResolverData<MyContext>,
    next: NextFn,
  ): Promise<NextFn> {
    const { user_id } = context;
    if (!user_id) throw new Error('Not authorized');

    const usersRepository = new UsersRepository();

    const isUser = await usersRepository.findById(user_id);
    if (!isUser) throw new Error('Not authorized');

    context.user_id = user_id;

    return next();
  }
}
