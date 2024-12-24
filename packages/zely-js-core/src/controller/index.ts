import { existsSync, mkdirSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import { join, relative } from 'node:path';

import { errorWithStacks, info, parseError, success } from '@zely-js/logger';
import { Context } from 'senta';
import chokidar from 'chokidar';
import type { UserConfig, ZelyRequest, ZelyResponse } from '~/zely-js-core';
import { isFunction, isObject } from '~/zely-js-core/lib/is';
import { removeExtension } from '~/zely-js-core/lib/ext';
import { WatchOptions } from '~/zely-js-core/types/watch';
import type { Page } from '~/zely-js-core';

import { handleExportDefault } from './handler/export-default';
import { handleExport } from './handler/export';
import { createLoader } from '../loader';
import reporter from '../reporter';

// Utility functions
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
  return Object.hasOwnProperty.call(m, 'default') ? m.default : m;
}

export function isExportDefault(m: any): boolean {
  const value = getValue(m);
  if (isObject(value)) return false;
  if (isFunction(value)) return true;
  if (Array.isArray(value)) return true;
  return false;
}

/**
 * PageCache class to manage page caching and watching
 */
export class PageCache {
  #modules: Page[] = [];

  config: UserConfig;

  loader: ReturnType<typeof createLoader>;

  map: Record<string, number>;

  constructor(page: Page[], config: UserConfig) {
    const loader = createLoader(config);
    const distPath = join(config.cwd || process.cwd(), config.dist || '.zely');

    if (config.keepDist !== true) {
      if (existsSync(distPath)) {
        rmSync(distPath, { recursive: true });
      }
      mkdirSync(distPath, { recursive: true });
    } else if (!existsSync(distPath)) {
      mkdirSync(distPath, { recursive: true });
    }

    writeFileSync(join(distPath, 'package.json'), '{"type": "commonjs"}');

    this.#modules = page;
    this.loader = loader;
    this.config = config;
    this.map = {};

    this.sort();

    if (process.env.NODE_ENV === 'development') {
      this.watch({}, this.config);
    }
  }

  // Sort pages by count of ":"
  sort() {
    const files: Record<number, Page[]> = {};

    this.#modules.forEach((file) => {
      const count = (file.path.match(/:/g) || []).length;
      if (!files[count]) files[count] = [];
      files[count].push(file);
    });

    this.#modules = Object.values(files).flat();
  }

  getPages(): Page[] {
    return this.#modules;
  }

  watch(options: WatchOptions, zely: UserConfig) {
    options.includes = options.includes || [];
    options.target = options.target || ['ts', 'tsx', 'js', 'jsx', 'html'];

    const base = join(zely.cwd || process.cwd(), 'pages');
    options.includes.push(
      join(base, `**/*.{${options.target.join(',')}}`).replace(/\\/g, '/'),
      'zely.config.*'
    );

    const watcher = chokidar.watch(options.includes, options.chokidar);

    watcher.on('change', (path: string) => {
      if (path.includes('zely.config')) {
        info('zely.config edited. Please restart to reload server');
        return;
      }

      const cache = this.readIdMap();
      cache[relative(base, path).replace(/\\/g, '/')] = performance.now();
      this.writeIdMap(cache);
    });
  }

  // Create production build
  async productionBuild() {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('production build is only available in production mode.');
    }

    const base = join(this.config.cwd || process.cwd(), 'pages');
    for await (const page of this.#modules) {
      const output = await this.loader(join(base, page.filename), {
        type: 'page',
        buildOptions: {},
      });

      page.module.data = getValue(output.module);
      page.module.builtPath = output.filename;
      page.module.builtMapPath = output.map;
      page.module.builtAssets = output.assets || [];
      page.module.type = isExportDefault(output.module) ? 'export-default' : 'export';
      page.module.isLoaded = true;
      page.id = performance.now();

      this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });
    }
  }

  // ID map management
  writeIdMap(data: any) {
    this.map = data;
  }

  readIdMap() {
    return this.map;
  }

  // Find module by path
  async getModule(path: string) {
    const id = this.readIdMap();
    const base = join(this.config.cwd || process.cwd(), 'pages');
    let page = findPage(path, this.#modules);

    if (!page) {
      const page404 = findPageByFilename('_404', this.#modules);
      if (page404) {
        page = page404;
        page.params = [];
      } else {
        return;
      }
    }

    if (process.env.NODE_ENV !== 'development') {
      return page;
    }

    if (page.module.__isVirtual__) {
      return page;
    }

    if (!page.module.isLoaded) {
      const output = await this.loader(join(base, page.filename), {
        type: 'page',
        buildOptions: {},
      });

      page.module.data = getValue(output.module);
      page.module.builtPath = output.filename;
      page.module.builtMapPath = output.map;
      page.module.builtAssets = output.assets || [];
      page.module.type = isExportDefault(output.module) ? 'export-default' : 'export';
      page.module.isLoaded = true;
      page.id = performance.now();

      this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });
      success(`${page.path}/ compiled successfully`, 'compiled');
    } else if (page.id !== id[page.filename]) {
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

      for (const asset of page.module.builtAssets) {
        if (existsSync(asset)) {
          unlinkSync(asset);
        }
      }

      page.module.data = getValue(output.module);
      page.module.builtPath = output.filename;
      page.module.builtMapPath = output.map;
      page.module.builtAssets = output.assets || [];
      page.module.type = isExportDefault(output.module) ? 'export-default' : 'export';
      page.id = id[page.filename];

      this.writeIdMap({ ...this.readIdMap(), [page.filename]: page.id });
      success(`${page.path}/ compiled successfully`, 'compiled');
    }

    return page;
  }
}

/**
 * Handle request and send response
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

    if (!m) {
      return next();
    }

    const ctx = new Context(req, res);
    ctx.__DEV__ = {
      path: m.filename,
      params: m.params,
      pattern: m.regex,
    };

    if (m.module.type === 'export-default') {
      await handleExportDefault(ctx, m, next);
    } else if (m.module.type === 'export') {
      await handleExport(ctx, m, next);
    }
  } catch (e) {
    if (userConfig?.enableReporter !== false) {
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

// Export type
export { Page };
