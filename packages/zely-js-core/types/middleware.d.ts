import { Request, Response } from '@zept/http';

export type Middleware = (
  req: Request,
  res: Response,
  next: () => void
) => Promise<void> | void;
