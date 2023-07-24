import type { ServerDataHandler } from 'zely';
import { get } from 'zely/methods';

export default [get({ title: 'Zely App' })] as ServerDataHandler[];
