import { methods } from './methods';
import { $store as $$store, $access as $$access, $cache as $$cache } from './store';

declare global {
  var GET: typeof methods.get;
  var POST: typeof methods.post;
  var DELETE: typeof methods.delete;
  var PUT: typeof methods.put;
  var ALL: typeof methods.all;

  var $store: typeof $$store;
  var $access: typeof $$access;
  var $cache: typeof $$cache;
}

export {};
