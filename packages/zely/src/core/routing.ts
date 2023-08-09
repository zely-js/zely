import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, parse, relative } from 'path';

import { Config, FileData } from '../config';
import { CACHE_DIRECTORY, CACHE_FILE, CACHE_VERSION } from '../constants';
import { typescriptLoader } from '../loader';
import { error, success } from '../logger';
import { handles } from './handles';

import { readDirectory } from '../../lib/readDirectory';
import { transformFilename } from '../../lib/transform-filename';
import { prettyURL } from '../../lib/pretty-url';
import { ZelyRequest, ZelyResponse } from '$zely/types';

let globalCache: any = null;

export async function getPages(config: Config): Promise<FileData | null> {
  let __cache: Record<string, string> = {};

  if (existsSync(CACHE_FILE)) {
    const cacheFile = JSON.parse(readFileSync(CACHE_FILE).toString());

    if (cacheFile.__CACHE_VERSION === CACHE_VERSION.toString()) {
      __cache = cacheFile.routes;
    }
  } else {
    success('success to create page cache file.');
  }

  const cache = new Map(Object.entries(__cache));

  const files = await Promise.all(
    readDirectory(config.routes || 'pages').map(async (file) => {
      file = relative(config.routes || 'pages', file);

      const { ext } = parse(file);
      const target = join(config.routes || 'pages', file);

      // already compiled
      if (cache.has(target)) {
        // load module
        const pageModule = require(relative(
          __dirname,
          join(CACHE_DIRECTORY, 'pages', cache.get(target))
        ));

        // custom path
        const pagePath = pageModule?.$page?.path;

        return {
          file: pagePath || file,
          m: pageModule,
          modulePath: join(CACHE_DIRECTORY, cache.get(target)),
          type: 'module',
        };
      }

      // https://github.com/do4ng/prext/issues/1
      // html
      if (ext === '.html') {
        const data = readFileSync(target).toString();

        return {
          file,
          m: data,
          modulePath: '',
          type: 'html',
        };
      }

      // result

      let r = null;

      // apply plugin

      await Promise.all(
        (config.plugins || []).map(async (plugin) => {
          try {
            if (plugin.transform) {
              const result = await plugin.transform(
                target,
                readFileSync(target).toString()
              );
              r = result;
            }
          } catch (e) {
            error(`[${plugin.name}] ${e}`);
          }
        })
      );

      if (r) {
        // console.log(r);
        return r;
      }

      if (target.endsWith('.ts') || target.endsWith('.js')) {
        try {
          const output = await typescriptLoader(target, config, 'pages');

          // https://github.com/do4ng/prext/issues/7
          // custom path feature
          const customPage = output?.m?.$page?.path;
          // console.log(customPage);

          cache.set(target, parse(output.filename).base);

          return {
            file: customPage || file,
            m: output.m,
            modulePath: output.filename,
            type: 'module',
            origin: file,
          };
        } catch (e) {
          error(`Occur ERROR while building ${file}\n${e}`);
        }
      }
      return null;
    })
  );

  const cacheJSON = Object.fromEntries(cache);

  if (!existsSync(CACHE_DIRECTORY)) mkdirSync(CACHE_DIRECTORY);

  writeFileSync(
    CACHE_FILE,
    JSON.stringify({
      base: 'pages',
      routes: { ...cacheJSON },
      // cache version
      __CACHE_VERSION: CACHE_VERSION.toString(),
    })
  );

  return files as any;
}

export function filenameToRoute(map: Array<FileData>, useBrackets: boolean = false) {
  const rawfiles = map.map((page) => {
    if (page) {
      let { file } = page;
      // eslint-disable-next-line prefer-const
      let { dir, name } = parse(file);

      if (name === 'index') {
        name = '';
      }

      file = join(dir, name);
      file = file.replace(/\\/g, '/');
      file = transformFilename(file, useBrackets);
      file = prettyURL(file);

      return {
        file,
        m: page.m,
        type: page.type,
        modulePath: page.modulePath,
        origin: page.file,
      };
    }
    return null;
  });

  const files = {};

  rawfiles.forEach((file) => {
    if (file) {
      const count = (file.file.match(/:/g) || []).length;

      if (!files[count]) files[count] = [];

      files[count].push(file);
    }
  });

  const filesResult: FileData[] = [];

  Object.keys(files).forEach((file) => {
    filesResult.push(...files[file]);
  });

  return filesResult;
}

export async function Handler(req: ZelyRequest, res: ZelyResponse, config: Config) {
  // prewrite

  // custom res.end

  // @ts-ignore
  res.send = async (chunk: string | number | object | any[], status?: number) => {
    // console.log(chunk, res.prewrite);

    if (status) res.status(status);

    if (Array.isArray(chunk)) {
      chunk = JSON.stringify(chunk as Array<any>);
    }

    switch (typeof chunk) {
      case 'string':
        break;
      case 'number':
        chunk = (chunk as number).toString();
        break;
      case 'object':
        chunk = JSON.stringify(chunk);
        break;
      default:
        break;
    }

    if (res.prewrite) {
      for await (const prewite of res.prewrite) {
        chunk = prewite(chunk);
      }
    }
    res.end(chunk);
  };

  try {
    if (!globalCache) {
      const pages = await getPages(config);
      globalCache = filenameToRoute(pages as any, config.useBrackets);

      await Promise.all(
        // eslint-disable-next-line array-callback-return
        config.plugins?.map(async (plugin) => {
          if (plugin.pages) await plugin.pages(globalCache);
        })
      );
    }
    // console.log(routes);

    if (config.handler) config.handler(req, res, globalCache as any);
    else handles(req, res, globalCache, config);
  } catch (e) {
    error(e);
  }
}

export function resetCache() {
  globalCache = null;
}
