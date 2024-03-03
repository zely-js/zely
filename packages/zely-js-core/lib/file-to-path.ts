/**
 * `api/$user.json.ts` => `api/:user.(json)`
 * @param filename filename
 */
export function transformFilename(filename: string, brakets?: boolean): string {
  filename = filename.replace(/\\/g, '/');
  if (brakets) {
    const sliced = filename.split('/');

    return sliced
      .map((part) => {
        if (part.startsWith('[...') && part.endsWith(']')) {
          return '*';
        }
        if (part.startsWith('[') && part.endsWith(']')) {
          return `:${part.slice(1, part.length - 1)}`;
        }
        return part;
      })
      .join('/');
  }

  return filename.replace(/\&\&/g, '*').replace(/\$/g, ':');
}
