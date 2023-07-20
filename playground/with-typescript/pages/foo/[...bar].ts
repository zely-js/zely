import { ZelyRequest, ZelyResponse } from 'zely';

export function get(req: ZelyRequest, res: ZelyResponse) {
  res.end(req.params.bar);
}
