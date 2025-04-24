/* eslint-disable guard-for-in */
import type { Context } from '@zely-js/core';

function isPromise(value: any): value is Promise<any> {
  return value instanceof Promise;
}

class Cache {
  ttl: number;

  cache: Record<any, any>;

  constructor(ttl) {
    this.ttl = ttl;
    this.cache = {};
  }

  clearExpired() {
    const now = Date.now();
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

const cache = new Cache(1000 * 60 * 6); // 6m TODO

export async function $serpack_cache(value: any, context: Context, name: string) {
  if (!isPromise(value)) {
    return value;
  }

  const id = `${name}-${context.__DEV__.path}-${Object.values(context.params).join('-')}`;
  const v = cache.get(id);
  if (v) {
    return v;
  }

  const output = await value;
  cache.set(id, output);

  return output;
}
