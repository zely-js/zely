declare class Response {
  body: any;

  headers: Record<string, any>;

  status: number;

  constructor(body: any, headers?: Record<string, any>);
}

export function response(body: any, headers?: Record<string, any>): Response;
