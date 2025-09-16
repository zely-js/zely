import { Context } from 'senta';
import { Context as ContextType } from '~/zely-js-core/types';
import { CreateData } from '~/zely-js-core/types/store';

class Cache {
  ttl: number;

  cache: Record<any, any>;

  constructor(ttl) {
    this.ttl = ttl;
    this.cache = {};
  }

  clearExpired() {
    const now = Date.now();
    // eslint-disable-next-line guard-for-in
    for (const key in this.cache) {
      const age = now - this.cache[key].timestamp;
      if (age > this.ttl) {
        delete this.cache[key];
      }
    }
  }

  set(key, value) {
    this.clearExpired();
    this.cache[key] = {
      value,
      timestamp: Date.now(),
    };
  }

  get(key) {
    this.clearExpired();
    const cacheItem = this.cache[key];
    return cacheItem ? cacheItem.value : null;
  }

  length() {
    return Object.keys(this.cache).length;
  }
}

export const cache = new Cache(1000 * 60 * 6); // 6m TODO

async function $store(
  createData: CreateData,
  key?: string[] | ContextType,
  symbol?: string
) {
  if (key instanceof Context) {
    const params = Object.values(key.params || {});
    symbol = `${symbol}-${params.length}-${params.join('-')}`;
  } else {
    symbol = `${symbol}-${key.length}-${key.join('-')}`;
  }

  if (cache.get(symbol)) {
    return {
      data: cache.get(symbol),
      id: symbol,
    };
  }

  const value = await createData({ $id: symbol });

  cache.set(symbol, value);

  return {
    data: value,
    id: symbol,
  };
}

function $access(key: string) {
  const store = cache.get(key);

  return {
    value: store,
    set(value: any) {
      cache.set(key, value);
    },
    refresh() {
      cache.cache[key] = {
        ...cache.cache[key],
        timestamp: Date.now(),
      };
    },
  };
}

export { $store, $access, cache as $cache };
