import { methods } from '~/zely-js-core/src/controller/methods';

export default [
  methods.all(() => 'response all'),
  methods.post(() => 'response post'),
  methods.get(() => 'response get'),
];
