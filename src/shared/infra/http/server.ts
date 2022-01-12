/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server-express';
import { graphqlUploadExpress } from 'graphql-upload';
import app from './app';

import createSchema from '../graphql/Schema';
import { createContext as context } from '../graphql/Context';

app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

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
