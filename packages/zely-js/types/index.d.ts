import { createZelyServer } from '@zely-js/core';
import { Config } from './config';

export type Server = Awaited<ReturnType<typeof createZelyServer>>['server'];
export function zely(options: Config): Promise<Server>;
export * from '@zely-js/core';
export { Config };
export function defineConfig(config: Config): Config;
