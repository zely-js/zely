import { Context, Response } from '.';

export interface ServerDataHandlerResponse<T> {
  __typeof?: symbol;
  __method?: symbol;
  headers?: Record<string, string>;
  body?: T;
}

export type NoStrict<T extends Record<string, any>> = {
  [K in keyof T]: T[K];
} & {
  [K: string]: any;
};

type OmitPromiseMethods<T extends Promise<any>> = T extends Promise<infer R>
  ? Promise<R>
  : never;

export type ServerDataHandlerContextFunc<T> = (
  context: Context
) => NoStrict<T> | OmitPromiseMethods<Promise<NoStrict<T>>>;

export type ServerDataHandler<T = any> =
  | Record<any, any>
  | ServerDataHandlerContextFunc<T>;

// alias

export type ContextHandler<T = any> = ServerDataHandlerContextFunc<T>;
export type PageHandler = ServerDataHandler;
export type PageHandlerResponse<T = any> = ServerDataHandlerResponse<T>;

export interface METHODS {
  all: symbol;
  get: symbol;
  post: symbol;
  delete: symbol;
  put: symbol;
  middleware: symbol;
}

export type MethodBody<T = any> = NoStrict<T> | ContextHandler<T>;

type Handlers = 'all' | 'get' | 'post' | 'delete' | 'put' | 'middleware';

type ArrayHandler<T = any> = (
  body: MethodBody<T>,
  headers?: Record<string, string>
) => PageHandlerResponse<T>;

export const methods: {
  [key in Handlers]: ArrayHandler;
};

export const ALL: <T = any>(
  body: MethodBody<T>,
  headers?: Record<string, string>
) => PageHandlerResponse<T>;

export const GET: <T = any>(
  body: MethodBody<T>,
  headers?: Record<string, string>
) => PageHandlerResponse<T>;

export const PUT: <T = any>(
  body: MethodBody<T>,
  headers?: Record<string, string>
) => PageHandlerResponse<T>;

export const POST: <T = any>(
  body: MethodBody<T>,
  headers?: Record<string, string>
) => PageHandlerResponse<T>;

export const DELETE: <T = any>(
  body: MethodBody<T>,
  headers?: Record<string, string>
) => PageHandlerResponse<T>;

// **
export const middleware: ArrayHandler;
