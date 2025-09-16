import { Context } from './server';

export interface StoreContext {
  $id: string;
}

export type CreateData<T = any> = (ctx: StoreContext) => Promise<T> | T;
export function $store<T>(
  createData: CreateData<T>,
  dependencies?: string[] | Context
): Promise<{ data: T; id: string }>;

export function $access(key: string): {
  refresh();
  set(value: any);
  value: any;
};

interface Cache {
  ttl: number;

  cache: Record<any, any>;

  constructor(ttl: number);

  clearExpired();

  set(key: any, value: any): void;

  get(key: any): any;

  length(): number;
}

export const $cache: Cache;
