import { error, warn } from '@zely-js/logger';
import { ZelyRequest, ZelyResponse } from '~/zely-js-core';

/**
 * send response (object, number, string available as response.body)
 */
export async function sender(
  req: ZelyRequest,
  res: ZelyResponse,
  chunk: any,
  status?: number
) {
  if (res.writableEnded) return;

  // console.log(chunk, res.prewrite);

  if (status) res.status(status);

  if (Array.isArray(chunk)) {
    chunk = JSON.stringify(chunk as Array<any>);
  }

  switch (typeof chunk) {
    case 'string':
      break;
    case 'number':
      chunk = (chunk as number).toString();
      break;
    case 'object':
      chunk = JSON.stringify(chunk);
      break;
    case 'boolean':
      chunk = chunk.toString();
      break;
    case 'undefined':
      error("Server Error: 'undefined' is not a valid response body");
      return;
    case 'bigint':
      chunk = chunk.toString();
      break;

    default:
      warn(`unknow chunk type: ${typeof chunk} (received: ${chunk})`);
      break;
  }

  if (res.prewrite) {
    chunk = await res.prewrite(chunk);
  }

  res.end(chunk);
}
