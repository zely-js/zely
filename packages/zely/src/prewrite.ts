import { ServerResponse } from 'node:http';

// eslint-disable-next-line no-unused-vars
export function usePrewrite(response: ServerResponse, fn: (...data) => any): void {
  if (!response.prewrite) {
    response.prewrite = [];
  }

  response.prewrite.push(fn);
}
