import 'osik';
import 'http';

declare module 'osik' {
  export interface Request {
    params: any;
  }
}
declare module 'http' {
  export interface IncomingMessage {
    params: any;
  }
  export interface ServerResponse {
    prewrite?: Array<(...data) => any>;
  }
}
