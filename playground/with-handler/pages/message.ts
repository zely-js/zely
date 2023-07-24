import type { ServerDataHandler } from 'zely';
import { get } from 'zely/methods';

export default [(req) => get({ message: (req as any).message })] as ServerDataHandler[];
