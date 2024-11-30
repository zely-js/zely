/**
 * Enhanced html renderer - using https://segify.vercel.app/
 */

import { readFileSync } from 'fs';
import { warn } from '@zely-js/logger';
import { compile, serverRender } from 'segify';
import { UserConfig } from '~/zely-js-core/types';
import { createFrontendPage } from '..';

export async function useEnhancedHTML(target: string, options: UserConfig = {}) {
  const page = readFileSync(target, 'utf-8');
  let ssr = '';

  try {
    const servercompiled = await serverRender(page);
    ssr = servercompiled.output.map((a) => a.getText()).join('');
  } catch (e) {
    warn(`${e.toString()} -> server rendered html will not be applied`);
  }

  let browserSource = await compile(page, { noExport: true });

  // TODO : hydration
  browserSource = `${browserSource};const __props = JSON.parse(document.getElementById("__fe_props").innerText);document.getElementById("__fe").innerHTML = "";var __c=new Component(__props);__c.render(document.getElementById("__fe"));`;

  const output = await createFrontendPage(
    {
      body: {
        div: {
          attributes: {
            id: '__fe',
          },
          children: ssr,
        },
        script: {
          attributes: {
            id: '__fe_props',
            type: 'application/json',
          },
          children: '%props%',
        },
      },
      head: {},
      scripts: [
        {
          target,
          module: true,
          attributes: {},
          type: 'link',
        },
      ],
    },
    null,
    options,
    [
      {
        name: '@zely-js/core:html',
        setup(build) {
          build.onLoad({ filter: /\.html$/ }, () => ({
            contents: browserSource,
            loader: 'js',
          }));
        },
      },
    ]
  );

  return output;
}
