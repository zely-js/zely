import type { ServerDataHandler } from 'zely';
import { GET } from 'zely/methods';

export default [GET((req) => ({ message: (req as any).message }))] as ServerDataHandler[];
