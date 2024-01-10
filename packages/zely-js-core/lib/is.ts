export function isObject(obj: any): boolean {
  return !!obj && obj.constructor === Object;
}

export function isFunction(t: any): boolean {
  return typeof t === 'function';
}
