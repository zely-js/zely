export class Response {
  body: any;

  headers: Record<string, any>;

  status: number = 500;

  constructor(body: any, headers?: Record<string, any>) {
    this.body = body;
    this.headers = headers || {};
  }
}
