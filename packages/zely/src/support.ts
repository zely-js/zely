import { Request, Response } from 'osik';
import { apply } from './plugins/kit';

export function support(request: Request, response: Response) {
  apply(request, response);

  return { request, response };
}
