import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '../../../../../config/cache';

import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
    this.resetCache();
  }

  public async save(
    key: string,
    value: unknown,
    minutes_to_live?: number,
  ): Promise<void> {
    if (minutes_to_live)
      await this.client.set(
        `@cache:${key}`,
        JSON.stringify(value),
        'EX',
        minutes_to_live * 60,
      );
    else await this.client.set(`@cache:${key}`, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(`@cache:${key}`);

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(`@cache:${key}`);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => pipeline.del(key));

    await pipeline.exec();
  }

  private async resetCache(): Promise<void> {
    await this.invalidatePrefix('@cache');
  }
}
