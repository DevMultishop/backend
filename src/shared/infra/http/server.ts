/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server-express';

import app from './app';

import createSchema from '../graphql/Schema';
import { createContext as context } from '../graphql/Context';

const main = async () => {
  const apolloServer = new ApolloServer({
    schema: await createSchema,
    context,
    introspection: true,
    formatError: err => {
      console.log(`${new Date().toISOString()} | ${err.message}`);
      return err;
    },
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: true,
  });

  app.listen(3333, () =>
    console.log(`${new Date().toISOString()} | App listenning on port 3333!`),
  );
};

main().catch(err => console.log(err));
