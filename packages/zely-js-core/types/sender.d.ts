import { ZelyRequest, ZelyResponse } from './server';

/**
 * send response (object, number, string available as response.body)
 */
export function defaultSender(
  req: ZelyRequest,
  res: ZelyResponse,
  chunk: any,
  status?: number
): Promise<void>;

export function setSender(sender: typeof defaultSender): void;
