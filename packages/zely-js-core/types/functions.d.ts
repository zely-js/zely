import { ZeptServer } from '@zept/http';
import { UserConfig } from './config';

export function createZelyServer(options: UserConfig): Promise<ZeptServer>;
