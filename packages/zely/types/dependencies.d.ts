import 'zept';
import 'http';

/*
declare module 'zept' {
  export interface Zept {
    params: any;
  }
}
*/
declare module 'http' {
  export interface IncomingMessage {
    params: any;
  }
  export interface ServerResponse {
    prewrite?: Array<(...data) => any>;
  }
}
