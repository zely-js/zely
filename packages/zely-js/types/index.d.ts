import { createZelyServer } from '@zely-js/core';
import { Config } from './config';

export type Server = Awaited<ReturnType<typeof createZelyServer>>;
export function zely(options: Config): Promise<Server>;
