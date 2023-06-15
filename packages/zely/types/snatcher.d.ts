import { IncomingMessage, ServerResponse } from 'http';
import { Config } from '.';

export interface SnatchOutput {
  body: any;
  status: number;
  response: ServerResponse;
}

export function snatch(path: string, method?: string): Promise<SnatchOutput>;

export function snatcher(
  req: IncomingMessage,
  res: ServerResponse,
  config?: Config
): typeof snatch;
