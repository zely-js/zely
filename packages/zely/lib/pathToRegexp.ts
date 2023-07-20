export function pathToRegexp(
  path: string,
  loose: boolean
): { params: string[]; pattern: RegExp } {
  if (path[0] === '/') path = path.slice(1);

  const paths = path.split('/');
  let pattern = '';
  const params = [];

  paths.forEach((p) => {
    p = p.trim();

    if (p === '*') {
      pattern += '/(.*)';
      params.push('*');
    } else if (p[0] === ':') {
      if (p.endsWith('?')) {
        // /a/:b?
        pattern += '(?:/([^/]+?))?';
        p = p.slice(0, -1);
      } else if (p.endsWith('*')) {
        // /a/:b*
        pattern += '/(.*)';
        p = p.slice(0, -1);
      } else {
        pattern += '/([^/]+?)';
      }

      if (p.includes('.')) {
        params.push(p.slice(1, p.indexOf('.')));
        pattern += `${p.slice(p.indexOf('.'))}`;
      } else {
        params.push(p.slice(1));
      }
    } else {
      pattern += `/${p}`;
    }
  });
  return {
    params,
    pattern: new RegExp(`^${pattern}${loose ? '(?=$|/)' : '/?$'}`, 'i'),
  };
}
