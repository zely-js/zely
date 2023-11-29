import { Server, ZeptRequest, ZeptResponse } from 'zept';
import { Config } from '.';

export function handles(
  req: ZeptRequest,
  res: ZeptResponse,
  routes: {
    file: string;
    m: any;
    modulePath: string;
    type: string;
  }[]
);

export function applyPlugins(app: Server, config: Config);
