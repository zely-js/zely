import { ZeptServer } from '@zept/http';
import { UserConfig } from './config';

export function createZelyServer(options: UserConfig): Promise<{
  server: ZeptServer;
  applyZelyMiddlewares: (serverInstance: ZeptServer) => void;
}>;
export function productionBuild(options: UserConfig): Promise<void>;
