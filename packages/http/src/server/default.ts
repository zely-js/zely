import { createServer } from 'http';

import { CustomServer } from '../../types';

export function defaultServer(): CustomServer {
  return {
    createServer,
  };
}
