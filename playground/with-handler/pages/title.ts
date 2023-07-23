import { ServerDataHandler, methods } from 'zely';

export default [
  () =>
    methods.get({
      title: 'Zely App',
    }),
] as ServerDataHandler[];
