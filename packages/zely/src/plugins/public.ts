import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { lookup } from 'mime-types';
import { Middleware } from 'osik';

import { StaticOptions } from '..';

export function readDirectory(
  target: string,
  ignored: string[] = [],
  dirname: string = ''
): string[] {
  const files = readdirSync(target);
  const results = [];

  files.forEach((file) => {
    const t = join(target, file);

    if (ignored.includes(file.trim())) {
      // nothing
    } else if (statSync(join(target, file)).isDirectory()) {
      results.push(...readDirectory(t, ignored, join(dirname, file)));
    } else {
      results.push(join(dirname, file));
    }
  });

  return results;
}

export function prettyURL(path: string): string {
  if (path === '.') {
    path = '';
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (path.endsWith('/')) {
    path = path.slice(0, -1);
  }

  return path;
}

export function Static(target: string, options?: StaticOptions): Middleware {
  const files = readDirectory(target, options?.ignored);

  // console.log(files);

  return (req, res, next) => {
    const url = new URL(req.url, 'http://server/');

    let sent = false;

    files.forEach((file) => {
      const fileURL = new URL(file, `http://server/${prettyURL(options?.prefix || '')}`);

      // console.log(prettyURL(url.pathname), prettyURL(fileURL.pathname));

      if (prettyURL(url.pathname) === prettyURL(fileURL.pathname) && !sent) {
        sent = true;

        let mime = lookup(file);

        if (!mime) mime = `text/plain; charset=${options?.charset || 'utf-8'}`;

        res.setHeader('Content-Type', `${mime}; charset=${options?.charset || 'utf-8'}`);
        res.end(readFileSync(join(target, file)));
      }
    });

    if (!sent) {
      next();
    }
  };
}
