import { ZelyRequest } from 'zely';

export function get(req: ZelyRequest) {
  // edit "/middlewares/message.ts".
  return { message: (req as any).message };
}
