/* eslint-disable no-async-promise-executor */
import { IncomingMessage, ServerResponse } from 'node:http';
import { Config, assign } from '../config';
import { Handler } from '../core';

export function snatcher(req: IncomingMessage, res: ServerResponse, config?: Config) {
  const snatch = (path: string, method: string = 'get') =>
    new Promise(async (resolve) => {
      const end = (chunk: any) => {
        resolve({ body: chunk, status: res.statusCode, response: res });
      };

      const customRequest: any = req;
      const customResponse: any = res;

      customRequest.url = path;
      customRequest.method = method.toUpperCase();

      customResponse.end = ((chunk: any) => {
        end(chunk);
      }) as any;

      Handler(customRequest, customResponse as any, assign(config)).then(() => {
        end(null);
      });
    });

  return snatch;
}
