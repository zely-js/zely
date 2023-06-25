import { ZelyRequest, ZelyResponse } from 'zely';

export function get(req: ZelyRequest, res: ZelyResponse) {
  // edit "/middlewares/message.ts".
  res.json({ message: (req as any).message });
}
