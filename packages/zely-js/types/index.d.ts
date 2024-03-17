import { ZelyResponse, createZelyServer } from '@zely-js/core';
import { Config } from './config';

export type Server = Awaited<ReturnType<typeof createZelyServer>>['server'];
export function zely(options: Config): Promise<Server>;
export * from '@zely-js/core';
export { Config };
export function defineConfig(config: Config): Config;
export function usePrewrite(
  res: ZelyResponse,
  callback: (data: string) => Promise<string>
): void;
export * from './config';
