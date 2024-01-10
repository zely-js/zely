import methods from './methods';

declare global {
  var GET: typeof methods.GET;
  var POST: typeof methods.POST;
  var DELETE: typeof methods.DELETE;
  var PUT: typeof methods.PUT;
  var ALL: typeof methods.ALL;
}

export {};
