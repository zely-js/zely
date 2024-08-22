import { IncomingMessage, ServerResponse } from 'http';
import { Context } from 'senta';

export type ZelyRequest = IncomingMessage;
export type ZelyResponse = ServerResponse;

export { Context };
