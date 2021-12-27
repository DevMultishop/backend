import { container } from 'tsyringe';
import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import CheckUserAdminService from '../../../services/CheckUserAdminService';

import { MyContext } from '../../../../../shared/infra/graphql/Context';

export default class EnsureIsAdmin implements MiddlewareInterface<MyContext> {
  async use(
    { context }: ResolverData<MyContext>,
    next: NextFn,
  ): Promise<NextFn> {
    const { user_id } = context;
    if (!user_id) throw new Error('Not authorized');

    if (!(await container.resolve(CheckUserAdminService).execute(user_id)))
      throw new Error('Not authorized');

    context.user_id = user_id;

    return next();
  }
}
