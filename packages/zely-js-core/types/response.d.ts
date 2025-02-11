import { NoStrict } from './methods';

declare class Response<T> {
  __isResponse: true;

  body: NoStrict<T>;

  headers: Record<string, any>;

  status: number;

  constructor(body: NoStrict<T>, headers?: Record<string, any>);
}

export function response<T = any>(
  body: NoStrict<T>,
  headers?: Record<string, any>
): Response<T>;
