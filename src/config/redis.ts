interface IRedisConfig {
  host: string;
  port: number;
  password: string | undefined;
}

export default {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
} as IRedisConfig;
