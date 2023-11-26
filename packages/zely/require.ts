export async function load<T = any>(path: string): Promise<T> {
  if (__ESM__) {
    return await import(path);
  }

  // @ts-ignore
  return require(path);
}
