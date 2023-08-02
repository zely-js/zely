import { ALL, DELETE, GET, POST, PUT } from '../export-methods';

export * from './routing';
export * from './handles';

global.GET = GET;
global.POST = POST;
global.DELETE = DELETE;
global.PUT = PUT;
global.ALL = ALL;
