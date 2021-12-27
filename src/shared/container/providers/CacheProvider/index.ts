import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const CacheProvider = container.resolve(RedisCacheProvider);

container.registerInstance<ICacheProvider>('CacheProvider', CacheProvider);

export default CacheProvider;
