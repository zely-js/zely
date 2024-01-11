import { createZelyServer } from '@zely-js/core';

export type Server = Awaited<ReturnType<typeof createZelyServer>>;
