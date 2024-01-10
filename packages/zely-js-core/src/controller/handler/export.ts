import { warn } from '@zely-js/logger';

import { Context } from '~/zely-js-core/src/context';
import { Page, getValue } from '..';
import { applyParams } from './params';
import { sender } from '../../send';

export async function handleExport(ctx: Context, page: Page, next: () => void) {
  const method = ctx.request.method.toLowerCase();
  const pageModule = getValue(page.module.data) || {};
  const pageMethods = Object.keys(pageModule || {}).map((key) => key.toLowerCase());
  const pageData = pageModule.$page;

  const handler: any =
    Object.values(pageModule)[pageMethods.indexOf(method)] || pageModule.all;

  // if page not found
  if (!handler) return next();

  // apply params to request
  ctx.request = applyParams(ctx.request, page.regex, page.params);

  if (pageData?.path) {
    // deprecated feature
    // https://zely.netlify.app/guide/page#page-path

    warn(`$page.path is deprecated. [at ${page.filename}]`);
  }

  // $page.before
  if (pageData?.before) {
    await pageData.before(ctx);
  }

  // execute handler
  await sender(ctx.request, ctx.response, await handler(ctx));

  // $page.after
  if (pageData?.after) {
    await pageData.before(ctx);
  }
}
