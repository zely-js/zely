import { Request, Response } from '@zept/http';
// import { Context } from './server';

export type Middleware = (
  req: Request,
  res: Response,
  next: () => void
) => Promise<void> | void;
