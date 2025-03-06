/**
 * Enhanced html renderer - using https://segify.vercel.app/
 */

import { readFileSync } from 'fs';
import { compile } from 'segify';
import { UserConfig } from '~/zely-js-core/types';
import { createFrontendPage } from '..';

export async function useEnhancedHTML(target: string, options: UserConfig = {}) {
  const output = await createFrontendPage(
    {
      body: {
        div: {
          attributes: {
            id: '__fe',
          },
          children: '%ssr%',
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
          build.onLoad({ filter: /\.html$/ }, async (args) => {
            const isEntry = target === args.path;
            const page = readFileSync(args.path, 'utf-8');

            const compiledCode = await compile(page, { noExport: false });

            return {
              contents: `${compiledCode};const __props = JSON.parse(document.getElementById("__fe_props").innerText);document.getElementById("__fe").innerHTML = "";${
                isEntry
                  ? ';var __c=new Component(__props);__c.render(document.getElementById("__fe"));'
                  : ''
              }`,
              loader: 'js',
            };
          });
        },
      },
    ]
  );

  return output;
}
