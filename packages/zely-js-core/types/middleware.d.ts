import { Context } from 'senta';

export type Middleware = (ctx: Context, next: () => void) => Promise<void> | void;
