import type { ServerDataHandler } from 'zely';

type Users = Record<number, { name: string; about: string }>;

const users: Users = {
  1: { name: 'anonymous #1', about: 'I love cat.' },
  2: { name: 'anonymous #2', about: 'Hello.' },
  3: { name: 'anonymous #3', about: 'Awesome.' },
};

export default [
  GET((req, res) => {
    throw new Error('ERROR!');

    return users[req.params.id];
  }),
] as ServerDataHandler[];
