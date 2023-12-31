/**
 * `api/$user.json.ts` => `api/:user.(json)`
 * @param filename filename
 */
export function transformFilename(filename: string, brakets?: boolean): string {
  if (brakets) {
    const sliced = filename.split('/');

    return sliced
      .map((part) => {
        if (part.startsWith('[...') && part.endsWith(']')) {
          return `:${part.slice(4, part.length - 1)}*`;
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
