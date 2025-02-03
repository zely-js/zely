export function parseError(err: Error): {
  at: string;
  loc: string;
}[];

export function errorWithStacks(
  err: string,
  stacks: {
    at: string;
    loc: string;
  }[]
): void;

export function error(err: Error | string);
export function warn(message: string): void;
export function success(message: string, type?: string): void;
export function info(message: string): void;
export function debug(message: string): void;
