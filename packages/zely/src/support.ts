import { ZeptRequest, ZeptResponse } from 'zept';
import { apply } from './plugins/kit';

export function support(request: ZeptRequest, response: ZeptResponse) {
  apply(request, response);

  return { request, response };
}
