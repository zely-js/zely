import type { ServerDataHandler } from 'zely';

export default [GET((req) => ({ message: (req as any).message }))] as ServerDataHandler[];
