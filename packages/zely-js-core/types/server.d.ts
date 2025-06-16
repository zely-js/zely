import { IncomingMessage, ServerResponse } from 'http';
import { Context as SentaContext } from 'senta';

export type ZelyRequest = IncomingMessage;
export type ZelyResponse = ServerResponse;

interface Context extends SentaContext {
  debug: (message: string) => void;
}

export { Context };
