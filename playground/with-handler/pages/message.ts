import { ServerDataHandler, methods } from 'zely';

export default [
  (req) => methods.get({ message: (req as any).message }),
] as ServerDataHandler[];
