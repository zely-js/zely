import { ZeptRequest, ZeptResponse } from 'zept';
import { Config, ZelyRequest, ZelyResponse, pureMiddleware } from '.';

/*

Javascript API

*/

export type FileType = 'html' | 'module';

export type FileData = {
  file: string;
  m:
    | {
        [key: string]: (req: ZelyRequest, res: ZelyResponse) => void | Promise<void>;
      }
    | string;
  type: FileType;
  modulePath: string;
  origin?: string;
};

export function getPages(config: Config): Promise<FileData[]>;

export function filenameToRoute(map: FileData[]): FileData[];

export function Handler(
  req: ZeptRequest,
  res: ZeptResponse,
  config: Config
): Promise<void>;

export function handles(
  req: ZeptRequest,
  res: ZeptResponse,
  routes: FileData[],
  config: Config
): void;

/**
 * load typescript file
 * @param target
 */
export function typescriptLoader(
  target: string,
  config?: Config,
  type?: 'cache' | 'core' | 'pages' | 'middlewares'
): Promise<{ filename: string; m: any }>;

export interface Context {
  request: ZelyRequest;

  response: ZelyResponse;

  status: number;

  headers: Record<string, any>;

  body: any;

  params: Record<string, any>;

  query: object;

  props: object;

  // @zely/plugin-kit

  send(data: any): Promise<this>;

  header(headers: Record<string, any>): this;

  html(data: string): Promise<this>;

  json(data: any): Promise<this>;

  text(data: string): Promise<this>;
}

export interface Page {
  before?(req: ZelyRequest, res: ZelyResponse): void | Promise<void>;
  after?(req: ZelyRequest, res: ZelyResponse): void | Promise<void>;
  path?: string;
}

export function middleware(config: Config): Promise<pureMiddleware[]>;

export interface ServerDataHandlerResponse {
  __typeof?: symbol;
  __method?: symbol;
  headers?: Record<string, string>;
  body?: any;
}

export type ServerDataHandlerContextFunc = (
  context: Context
) =>
  | Promise<Record<any, any> | ServerDataHandlerResponse | void>
  | Record<any, any>
  | ServerDataHandlerResponse
  | void;

// alias
export type ContextHandler = ServerDataHandlerContextFunc;

export type ServerDataHandler = Record<any, any> | ServerDataHandlerContextFunc;
export type PageHandler = ServerDataHandler; // alias

export interface METHODS {
  all: symbol;
  get: symbol;
  post: symbol;
  delete: symbol;
  put: symbol;
}

export type MethodBody = Record<any, any> | ContextHandler;

export const methods: {
  all(body: MethodBody, headers?: Record<string, string>): ServerDataHandlerResponse;

  get(body: MethodBody, headers?: Record<string, string>): ServerDataHandlerResponse;

  post(body: MethodBody, headers?: Record<string, string>): ServerDataHandlerResponse;

  delete(body: MethodBody, headers?: Record<string, string>): ServerDataHandlerResponse;

  put(body: MethodBody, headers?: Record<string, string>): ServerDataHandlerResponse;
};
