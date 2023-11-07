import type { PageHandler } from 'zely';
import { GET } from 'zely/methods';

export default [
  GET((context) => ({ message: (context.request as any).message })),
] satisfies PageHandler;
