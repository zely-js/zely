import { ZelyRequest, ZelyResponse } from '~/zely-js-core';
import { sender } from './send';

export class Context {
  request: ZelyRequest;

  response: ZelyResponse;

  headers: Record<string, any>;

  body: any;

  query: object;

  props: object;

  params: Record<string, any>;

  constructor(req: ZelyRequest, res: ZelyResponse) {
    this.request = req;
    this.response = res;
    this.body = req.body;
    this.query = req.query || {};
    this.params = req.params || {};
    this.props = req.props;
  }

  status(code: number): this {
    this.response.statusCode = code;

    return this;
  }

  // @zely/plugin-kit

  async send(data: any): Promise<this> {
    await sender(this.request, this.response, data, this.response.statusCode);

    return this;
  }

  header(headers: Record<string, any>): this {
    this.headers = headers;

    for (const header of Object.keys(headers)) {
      this.response.setHeader(header, headers[header]);
    }

    return this;
  }

  async html(data: string): Promise<this> {
    this.response.send(data);

    return this;
  }

  async json(data: any): Promise<this> {
    this.response.send(data);

    return this;
  }

  async text(data: string): Promise<this> {
    await this.response.send(data);

    return this;
  }
}
