import { ZeptRequest, ZeptResponse } from 'zept';
import './';
import { snatch } from './';

export interface ZelyRequest extends ZeptRequest {
  query: object;
  snatch: typeof snatch;
}

// https://github.com/do4ng/prext/issues/11

export interface ZelyResponse extends ZeptResponse {
  // default supported
  // json: (data: any) => void;
  html: (code: string) => this;
  send: (chunk: string | Array<any> | object | number, status?: number) => this;
  status: (code: number) => this;
  sendFile: (filePath: string) => this;
}

export type requestHandler = (req: ZelyRequest, res: ZelyResponse) => void;
