import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { serverRender } from 'segify';
import { join, parse } from 'path';

import { warn } from '@zely-js/logger';

import { Loader } from '~/zely-js/types';
import { useEnhancedHTML } from './enhanced';

const HTMLloader = (options: any): Loader => ({
  name: '@zely-js/core:html',
  async transform(id) {
    if (!id.endsWith('.html')) return;
    const { template: output, built } = await useEnhancedHTML(id, options);

    const dist = join(
      options.cwd || process.cwd(),
      options.dist || '.zely',
      'fe',
      'generated'
    );
    const filename = parse(id).name;
    const outfile = join(
      dist,
      `${filename}.${(Math.random() + 1).toString(36).substring(7)}.js`
    );
    mkdirSync(dist, { recursive: true });

    const code = `[core.GET(async(c) => c.html(\`${output.replace(
      /\\/g,
      '\\\\'
    )}\`.replace("%ssr%", await $$ssrCompiler(c)).replace("%props%", JSON.stringify({params: c.params}))))];`;

    const ssrCompiler = `
var $$ssrCompiler=async (c) => {
  let __ssr = '';
  try {
    var $$servercompiled = await $$serverRender(require("fs").readFileSync(${JSON.stringify(
      id
    )}).toString(), {params:c.params});
    __ssr = $$servercompiled.output.map((a) => a.getText()).join('');
  } catch (e) {
    console.error(e);
    $$logger.warn("Error occurred while compiling server-side rendered HTML");
    __ssr = "";
  }
    return __ssr;
  }`.replace(/\n/g, '');

    writeFileSync(
      outfile,
      `const core=require("@zely-js/core");const {serverRender: $$serverRender}=require("segify");const $$logger=require("@zely-js/logger");${ssrCompiler};module.exports = ${code}`
    );

    return { filename: outfile, map: null, assets: Object.values(built) };
  },
});

export { HTMLloader };
