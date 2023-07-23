import { ServerDataHandlerResponse } from '$zely/types';

export const METHODS = {
  all: Symbol('all'),
  get: Symbol('get'),
  post: Symbol('post'),
  delete: Symbol('delete'),
  put: Symbol('put'),
};

export const methods = {
  all(body: any, headers?: Record<string, string>): ServerDataHandlerResponse {
    return {
      __typeof: Symbol.for('zely:handler'),
      __method: METHODS.all,
      body,
      headers,
    };
  },

  get(body: any, headers?: Record<string, string>): ServerDataHandlerResponse {
    return {
      __typeof: Symbol.for('zely:handler'),
      __method: METHODS.get,
      body,
      headers,
    };
  },

  post(body: any, headers?: Record<string, string>): ServerDataHandlerResponse {
    return {
      __typeof: Symbol.for('zely:handler'),
      __method: METHODS.post,
      body,
      headers,
    };
  },

  delete(body: any, headers?: Record<string, string>): ServerDataHandlerResponse {
    return {
      __typeof: Symbol.for('zely:handler'),
      __method: METHODS.delete,
      body,
      headers,
    };
  },

  put(body: any, headers?: Record<string, string>): ServerDataHandlerResponse {
    return {
      __typeof: Symbol.for('zely:handler'),
      __method: METHODS.put,
      body,
      headers,
    };
  },
};
