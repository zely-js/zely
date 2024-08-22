import { warn } from '@zely-js/logger';
import { ZelyRequest, ZelyResponse } from '~/zely-js-core';
import { Response } from './response/response';

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

  // eslint-disable-next-line no-return-assign
  const setStatus = (s: number) => (res.statusCode = s);

  // is response()
  if (chunk instanceof Response) {
    for (const header of Object.keys(chunk.headers)) {
      res.setHeader(header, chunk.headers[header]);
    }
    setStatus(chunk.status);

    sender(req, res, chunk.body);

    return;
  }

  if (status) setStatus(status);

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
      warn("Server Error: 'undefined' is not a valid response body");
      return;
    case 'bigint':
      chunk = chunk.toString();
      break;

    default:
      warn(`unknow chunk type: ${typeof chunk} (received: ${chunk})`);
      break;
  }

  if ((res as any).prewrite) {
    const prewritten = await (res as any).prewrite(chunk);

    if (typeof prewritten === 'string') {
      chunk = prewritten;
    } else {
      chunk = prewritten.content;

      for (const header of Object.keys(prewritten.headers)) {
        res.setHeader(header, prewritten.headers[header]);
      }
    }
  }

  res.end(chunk);
}
