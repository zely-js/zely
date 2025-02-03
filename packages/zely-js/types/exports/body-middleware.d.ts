import '@zely-js/core';
import 'http';
declare module '@zely-js/core' {
  interface Context {
    body: any;
  }
}

declare module 'http' {
  interface IncomingMessage {
    body: any;
  }
}
