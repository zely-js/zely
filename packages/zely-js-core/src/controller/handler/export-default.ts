import { warn } from '@zely-js/logger';
import { Context } from 'senta';

import { Page, getValue } from '..';
import { applyParams } from './params';
import { isFunction } from '~/zely-js-core/lib/is';
import { sender } from '../../send';

function getHandlerType(handler: any): 'function' | 'method' | 'raw' {
  if (isFunction(handler)) {
    return 'function';
  }

  if (handler?.__typeof === Symbol.for('zely:handler')) {
    return 'method';
  }
  return 'raw';
}

export async function handleExportDefault(ctx: Context, page: Page, next: () => void) {
  const method = ctx.request.method.toLowerCase();
  let pageModule: Array<any> = getValue(page.module.data) || [];
  const pageData = page.module.data?.$page || {};

  if (!Array.isArray(pageModule)) {
    pageModule = [pageModule];
  }

  const handler: any = pageModule.filter(
    (m) =>
      m.__method?.description?.toLowerCase() === method ||
      m.__method?.description?.toLowerCase() === 'all' ||
      isFunction(m)
  )[0];
  const middlewares = pageModule.filter(
    (m) => m.__method?.description?.toLowerCase() === 'middleware'
  );
  const type = getHandlerType(handler);

  // apply params to request
  ctx.params = (applyParams(ctx.request, page.regex, page.params) as any).params;

  // execute middlewares
  for await (const middleware of middlewares || []) {
    if (typeof middleware.body !== 'function') {
      throw new Error('middleware.body must be a function');
    }

    await middleware.body(ctx);

    if (ctx.response.writableEnded) return;
  }

  // if page not found
  if (!handler) return next();

  if (pageData?.path) {
    // deprecated feature
    // https://zely.netlify.app/guide/page#page-path

    warn(`$page.path is deprecated feature. [at ${page.filename}]`);
  }

  // $page.before
  if (pageData?.before) {
    await pageData.before(ctx);
  }

  // execute handler

  if (type === 'function') {
    const response = await handler(ctx);
    await sender(ctx.request, ctx.response, response, 200);
  } else if (type === 'method') {
    if (typeof handler.body === 'function') {
      const response = await handler.body(ctx);
      await sender(ctx.request, ctx.response, response, 200);
    } else {
      await sender(ctx.request, ctx.response, handler.body, 200);
    }
  } else {
    await sender(ctx.request, ctx.response, handler, 200);
  }

  // $page.after
  if (pageData?.after) {
    await pageData.after(ctx);
  }
}
