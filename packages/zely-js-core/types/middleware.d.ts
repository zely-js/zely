import { Request, Response } from '@zely-js/http';

export type Middleware = (
  req: Request,
  res: Response,
  next: () => void
) => Promise<void> | void;
