import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { verify } from 'jsonwebtoken';
import authConfig from '../../../config/auth';

export interface MyContext {
  user_id?: string;
}

interface TokenPayload {
  iat: number;
  ext: number;
  subject: string;
}

export function createContext(context: ExpressContext): MyContext {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    return {};
  }

  const [, token] = authHeader.split(' ');

  const {
    jwt: { secret },
  } = authConfig;

  try {
    const decoded = verify(token, secret);

    const { subject } = decoded as TokenPayload;

    return { user_id: subject };
  } catch {
    throw new Error('Unauthorized');
  }
}
