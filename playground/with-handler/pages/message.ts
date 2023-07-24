import type { ServerDataHandler } from 'zely';
import { GET } from 'zely/methods';

export default [(req) => GET({ message: (req as any).message })] as ServerDataHandler[];
