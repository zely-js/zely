import { Context } from '.';

export interface ServerDataHandlerResponse {
  __typeof?: symbol;
  __method?: symbol;
  headers?: Record<string, string>;
  body?: any;
}

export type ServerDataHandlerContextFunc = (
  context: Context
) =>
  | Promise<Record<any, any> | PageHandlerResponse | void>
  | Record<any, any>
  | PageHandlerResponse
  | void;

export type ServerDataHandler = Record<any, any> | ServerDataHandlerContextFunc;

// alias

export type ContextHandler = ServerDataHandlerContextFunc;
export type PageHandler = ServerDataHandler;
export type PageHandlerResponse = ServerDataHandlerResponse;

export interface METHODS {
  all: symbol;
  get: symbol;
  post: symbol;
  delete: symbol;
  put: symbol;
}

export type MethodBody = Record<any, any> | ContextHandler;

export const methods: {
  all(body: MethodBody, headers?: Record<string, string>): PageHandlerResponse;

  get(body: MethodBody, headers?: Record<string, string>): PageHandlerResponse;

  post(body: MethodBody, headers?: Record<string, string>): PageHandlerResponse;

  delete(body: MethodBody, headers?: Record<string, string>): PageHandlerResponse;

  put(body: MethodBody, headers?: Record<string, string>): PageHandlerResponse;
};

export const ALL: typeof methods.all;
export const GET: typeof methods.get;
export const PUT: typeof methods.put;
export const POST: typeof methods.post;
export const DELETE: typeof methods.delete;
