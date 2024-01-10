import { Context } from './server';

export type Middleware = (ctx: Context, next: () => void) => Promise<void>;
