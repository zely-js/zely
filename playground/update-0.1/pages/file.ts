import { join } from 'path';
import { ZelyRequest, ZelyResponse } from 'zely';

export function get(req: ZelyRequest, res: ZelyResponse) {
  res.sendFile(join(process.cwd(), './package.json'));
}
