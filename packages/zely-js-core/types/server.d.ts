import { Request, Response } from '@zely-js/http';

export interface ZelyRequest extends Request {
  params: Record<string, any>;
  query: Record<string, any>;
  props: Record<string, any>;
}
export interface ZelyResponse extends Response {
  html: (code: string) => this;
  send: (chunk: string | Array<any> | object | number, status?: number) => this;
  status: (code: number) => this;
  sendFile: (filePath: string) => this;
  prewrite: (
    data: string
  ) => Promise<string | { content: string; headers: Record<string, string> }>;
}

export interface Context {
  request: ZelyRequest;

  response: ZelyResponse;

  status: (code: number) => this;

  headers: Record<string, any>;

  body: any;

  params: Record<string, any>;

  query: object;

  props: object;

  send(data: any): Promise<this>;

  header(headers: Record<string, any>): this;

  html(data: string): Promise<this>;

  json(data: any): Promise<this>;

  text(data: string): Promise<this>;
}
