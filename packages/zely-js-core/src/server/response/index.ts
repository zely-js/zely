import { Response } from './response';

export function response(body: any, headers?: Record<string, any>): Response {
  return new Response(body, headers);
}
