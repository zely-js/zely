import type { ZelyResponse } from '@zely-js/core';

export function usePrewrite(
  res: ZelyResponse,
  callback: (data: string) => Promise<string>
) {
  (res as any).prewrite = (data: string) => callback(data);
}
