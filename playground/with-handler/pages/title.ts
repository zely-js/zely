import type { ServerDataHandler } from 'zely';
import { GET } from 'zely/methods';

export default [GET({ title: 'Zely App' })] as ServerDataHandler[];
