import { errorWithStacks, parseError, success } from '@zely-js/logger';
import reporter from '@zely-js/reporter';

import { Context } from 'senta';

import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join } from 'node:path';

import type { UserConfig, ZelyRequest, ZelyResponse } from '~/zely-js-core';
import { isFunction, isObject } from '~/zely-js-core/lib/is';
import { removeExtension } from '~/zely-js-core/lib/ext';
import type { Page } from '~/zely-js-core';

import { handleExportDefault } from './handler/export-default';
import { handleExport } from './handler/export';
import { createLoader } from '../loader';

const HASH_DIRECTORY = (config: any) =>
  join(config.cwd || process.cwd(), config.dist || '.zely', 'pages.hash.json');

function findPage(path: string, pages: Page[]) {
  for (const page of pages) {
    if (page.regex.test(path)) {
      return page;
    }
  }
  return null;
}

function findPageByFilename(filename: string, pages: Page[]) {
  for (const page of pages) {
    if (removeExtension(page.filename).replace(/\\/g, '/').endsWith(filename)) {
      return page;
    }
  }
  return null;
}

export function getValue(m: any) {
  // console.log(m);
  return Object.hasOwnProperty.call(m, 'default') ? m.default : m;
}

export function isExportDefault(m: any): boolean {
  /**
   * export default {
   *  get() {}
   * }
   */
  if (isObject(getValue(m))) {
    return false;
  }

  if (isFunction(getValue(m))) {
    return true;
  }
  if (Array.isArray(getValue(m))) {
    return true;
  }
  return false;
}

/**
 * When a file is modified (in development mode),
 * the page is not compiled immediately, but when the page is loaded.
 *
 */
export class PageCache {
  #modules: Page[] = [];

  config: UserConfig;

  loader: ReturnType<typeof createLoader>;

  constructor(page: Page[], config: UserConfig) {
    const loader = createLoader(config);

    if (config.keepDist !== true) {
      if (existsSync(join(config.cwd || process.cwd(), config.dist || '.zely'))) {
        rmSync(join(config.cwd || process.cwd(), config.dist || '.zely'), {
          recursive: true,
        });
      }

      mkdirSync(join(config.cwd || process.cwd(), config.dist || '.zely'), {
        recursive: true,
      });
    } else if (!existsSync(join(config.cwd || process.cwd(), config.dist || '.zely'))) {
      mkdirSync(join(config.cwd || process.cwd(), config.dist || '.zely'), {
        recursive: true,
      });
    }

    writeFileSync(HASH_DIRECTORY(config), '{}');

    // support esm
    writeFileSync(
      join(config.cwd || process.cwd(), config.dist || '.zely', 'package.json'),
      '{"type": "commonjs"}'
    );

    this.#modules = page;
    this.loader = loader;
    this.config = config;

    this.sort();
  }

  // sort by count of ":"
  sort() {
    const files = {};

    this.#modules.forEach((file) => {
      const count = (file.path.match(/:/g) || []).length;

      if (!files[count]) files[count] = [];
      files[count].push(file);
    });

    const filesResult: any[] = [];

    Object.keys(files).forEach((file) => {
      filesResult.push(...files[file]);
    });
    this.#modules = filesResult;
  }

  getPages(): Page[] {
    return this.#modules;
  }

  // create production build
  async productionBuild() {
    const base = join(this.config.cwd || process.cwd(), 'pages');

    // build all pages

    if (process.env.NODE_ENV === 'production') {
      for await (const page of this.#modules) {
        const output = await this.loader(join(base, page.filename), {
          type: 'page',
          buildOptions: {},
        });

        page.module.data = getValue(output.module);
        page.module.builtPath = output.filename;
        page.module.builtMapPath = output.map;
        page.module.type = isExportDefault(output.module) ? 'export-default' : 'export';
        page.module.isLoaded = true;
        page.id = performance.now();

        this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });
      }
    } else {
      throw new Error('production build is only available in production mode.');
    }
  }

  // id map
  writeIdMap(data: any) {
    writeFileSync(HASH_DIRECTORY(this.config), JSON.stringify(data));
  }

  readIdMap() {
    return JSON.parse(readFileSync(HASH_DIRECTORY(this.config)).toString());
  }

  // find module by path
  async getModule(path: string) {
    const id = this.readIdMap();
    const base = join(this.config.cwd || process.cwd(), 'pages');

    let page = findPage(path, this.#modules);

    // error handling (404)

    if (!page) {
      const page404 = findPageByFilename('_404', this.#modules);

      page = {} as any;

      if (page404) {
        // set page

        page = page404;
        page.params = [];
      } else {
        return;
      }
    }

    // in production mode all pages are compiled
    if (process.env.NODE_ENV !== 'development') {
      return page;
    }

    // virtual page must not be edited
    if (page.module.__isVirtual__) {
      return page;
    }

    // compile code

    if (!page.module.isLoaded) {
      // when page isn't loaded

      const output = await this.loader(join(base, page.filename), {
        type: 'page',
        buildOptions: {},
      });

      page.module.data = getValue(output.module);
      page.module.builtPath = output.filename;
      page.module.builtMapPath = output.map;
      page.module.type = isExportDefault(output.module) ? 'export-default' : 'export';
      page.module.isLoaded = true;
      page.id = performance.now();

      this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });

      success(`${`${page.path}/`} compiled successfully`, 'compiled');
    } else if (page.id !== id[page.filename]) {
      // when page was modified

      const output = await this.loader(join(base, page.filename), {
        type: 'page',
        buildOptions: {},
      });

      if (
        existsSync(page.module.builtPath) &&
        output.filename !== page.module.builtPath
      ) {
        unlinkSync(page.module.builtPath);
      }
      if (
        existsSync(page.module.builtMapPath) &&
        output.map !== page.module.builtMapPath
      ) {
        unlinkSync(page.module.builtMapPath);
      }

      page.module.data = getValue(output.module);
      page.module.builtPath = output.filename;
      page.module.builtMapPath = output.map;
      page.module.type = isExportDefault(output.module) ? 'export-default' : 'export';

      page.id = id[page.filename];

      this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });

      success(`${`${page.path}/`} compiled successfully`, 'compiled');
    }

    return page;
  }
}

/**
 * handle request and send response
 *
 * @param req Zept Request
 * @param res Zept Response
 * @param next Next middleware
 */
export async function controll(
  req: ZelyRequest,
  res: ZelyResponse,
  next: () => void,
  userConfig: UserConfig,
  cache: PageCache
) {
  let m: Page = null;
  try {
    m = await cache.getModule(req.url);

    // if page not found in cache
    if (!m) {
      return next();
    }

    const ctx = new Context(req, res);

    // DEV context
    ctx.__DEV__ = {
      path: m.filename,
      params: m.params,
      pattern: m.regex,
    };

    if (m.module.type === 'export-default') {
      await handleExportDefault(ctx, m, next);
    }

    if (m.module.type === 'export') {
      await handleExport(ctx, m, next);
    }
  } catch (e) {
    if (userConfig?.enableReporter !== false) {
      // if error happens in virtual page

      if (m?.module.__isVirtual__) {
        const err = parseError(e);

        errorWithStacks(e.message, [
          {
            loc: `(virtual:${m?.filename})`,
            at: `${m.module.type}[${req.method || 'ANY'}|ALL]`,
          },
          ...err,
        ]);
      } else {
        // error with js map

        await reporter(e);
      }
    }
    if (userConfig?.onError) {
      await userConfig?.onError(e);
    }

    res.statusCode = 500;
    res.end('500 Server Error');
  }
}

// export type
export { Page };
