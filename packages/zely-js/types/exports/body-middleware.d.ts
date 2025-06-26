import '@zely-js/core';
import 'http';
declare module 'senta' {
  interface Context {
    body: any;
  }
}

declare module 'http' {
  interface IncomingMessage {
    body: any;
  }
}
