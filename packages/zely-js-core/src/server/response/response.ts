export class Response {
  body: any;

  headers: Record<string, any>;

  status: number = 500;

  _isResponse = true;

  constructor(body: any, headers?: Record<string, any>) {
    this.body = body;
    this.headers = headers || {};
  }
}
