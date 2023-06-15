import { Request, Response } from 'osik';

export function handles(
  req: Request,
  res: Response,
  routes: {
    file: string;
    m: any;
    modulePath: string;
    type: string;
  }[]
);
