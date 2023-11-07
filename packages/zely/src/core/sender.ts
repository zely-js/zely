import { ZelyRequest, ZelyResponse } from '$zely/types';

export async function sender(
  req: ZelyRequest,
  res: ZelyResponse,
  chunk: string | number | object | any[],
  status?: number
) {
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
    default:
      break;
  }

  if (res.prewrite) {
    for await (const prewite of res.prewrite) {
      chunk = prewite(chunk);
    }
  }
  res.end(chunk);
}
