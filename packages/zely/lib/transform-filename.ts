/**
 * `api/$user.json.ts` => `api/:user.(json)`
 * @param filename filename
 */
export function transformFilename(filename: string): string {
  return filename.replace(/\&\&/g, '*').replace(/\$/g, ':');
}
