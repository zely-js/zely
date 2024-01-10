import { createLoader } from '@zely-js/loader';
import { success } from '@zely-js/logger';

import { existsSync, mkdirSync, readFileSync, rmdirSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join, relative } from 'node:path';

import { UserConfig, ZelyRequest, ZelyResponse } from '~/zely-js-core';
import { Context } from '../context';
import { isFunction, isObject } from '~/zely-js-core/lib/is';
import { handleExportDefault } from './handler/export-default';
import { handleExport } from './handler/export';

const HASH_DIRECTORY = (config: any) =>
  join(config.cwd || process.cwd(), config.dist || '.zely', 'pages.hash.json');

export interface Page {
  filename: string;
  path: string;
  regex: RegExp;
  id: number;
  params: string[];

  module: {
    /**
     * "export"
     *
     * ~~ctx available in 3~~
     *
     * ```diff
     * - export function get(req, res) {}
     * + export function get(ctx) {}
     * ```
     * "export default"
     * ```ts
     * export default [(ctx) => {}];
     * ```
     */
    type: 'export' | 'export-default' | 'unknown';

    /**
     * zely@3 don't compile code before first request of specific page
     */
    isLoaded: boolean;

    /**
     * page module
     * `{"get": () => {...}}`
     */
    data?: any;

    builtPath?: string;
    builtMapPath?: string;
  };
}

function findPage(path: string, pages: Page[]) {
  for (const page of pages) {
    if (page.regex.test(path)) {
      return page;
    }
  }
  return null;
}

async function load(id: string) {
  const relativePath = relative(__dirname, id).replace(/\\/g, '/');
  if (__ESM__) {
    return await import(relativePath);
  }
  return require(relativePath);
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

    if (existsSync(join(config.cwd || process.cwd(), config.dist || '.zely'))) {
      rmdirSync(join(config.cwd || process.cwd(), config.dist || '.zely'), {
        recursive: true,
      });
    }

    mkdirSync(join(config.cwd || process.cwd(), config.dist || '.zely'), {
      recursive: true,
    });

    if (!existsSync(HASH_DIRECTORY(config))) {
      writeFileSync(HASH_DIRECTORY(config), '{}');
    }

    this.#modules = page;
    this.loader = loader;
    this.config = config;
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
    const page = findPage(path, this.#modules);
    const id = this.readIdMap();
    const base = join(this.config.cwd || process.cwd(), 'pages');

    if (!page) {
      return null;
    }

    // in production mode all pages are compiled
    if (process.env.NODE_ENV !== 'development') {
      return await load(page.filename);
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

      success(`${page.path} compiled successfully`, 'compiled');
    } else if (page.id !== id[page.filename]) {
      // when page was modified

      const output = await this.loader(join(base, page.filename), {
        type: 'page',
        buildOptions: {},
      });

      page.module.data = getValue(output.module);
      page.module.builtPath = output.filename;
      page.module.builtMapPath = output.map;
      page.module.type =
        output.module.default || output.module[0]?.__typeof === Symbol.for('zely:handler')
          ? 'export-default'
          : 'export';

      page.id = id[page.filename];

      this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });

      success(`${page.path} compiled successfully`, 'compiled');
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
  const m: Page = await cache.getModule(req.url);

  // if page not found in cache
  if (!m) {
    return next();
  }

  const ctx = new Context(req, res);

  if (m.module.type === 'export-default') {
    await handleExportDefault(ctx, m, next);
  }

  if (m.module.type === 'export') {
    await handleExport(ctx, m, next);
  }
}
