// eslint-disable-next-line no-unused-vars
export function ObjectkeysMap(obj: any, callback: (key: string) => string) {
  const result = {};

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      result[callback(key)] = ObjectkeysMap(obj[key], callback);
    } else {
      result[callback(key)] = obj[key];
    }
  });

  return result;
}
