export const queryToJson = (query: string): any =>
  Object.fromEntries(new URLSearchParams(query));
