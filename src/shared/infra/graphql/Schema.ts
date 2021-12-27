import { buildSchema, Resolver, Query } from 'type-graphql';
import UsersResolvers from '../../../modules/users/infra/graphql/resolvers';
import BitcoinResolvers from '../../../modules/bitcoin/infra/graphql/resolvers';

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello(): Promise<string> {
    return 'hello';
  }
}

function createSchema() {
  return buildSchema({
    resolvers: [HelloResolver, ...UsersResolvers, ...BitcoinResolvers],
    validate: false,
  });
}

export default createSchema();
