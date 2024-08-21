import { methods } from './methods';

declare global {
  var GET: typeof methods.get;
  var POST: typeof methods.post;
  var DELETE: typeof methods.delete;
  var PUT: typeof methods.put;
  var ALL: typeof methods.all;
}

export {};
