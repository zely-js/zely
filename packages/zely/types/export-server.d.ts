import { ZeptRequest, ZeptResponse } from 'zept';

export function handles(
  req: ZeptRequest,
  res: ZeptResponse,
  routes: {
    file: string;
    m: any;
    modulePath: string;
    type: string;
  }[]
);
