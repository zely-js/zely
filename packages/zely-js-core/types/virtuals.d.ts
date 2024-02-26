import type { PageHandlerResponse } from './methods';
import { Context } from './server';

export type SupportEsm<T> = T | { default: T };

export type PageModule =
  | SupportEsm<PageHandlerResponse[]>
  | SupportEsm<Record<string, (ctx: Context) => any | Promise<any>>>;

export function createVirtualPage(filename: string, pageModule: PageModule): any;
