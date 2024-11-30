import { Plugin, build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import type { FeComponent, FePageData, FeScripts, UserConfig } from '~/zely-js-core';

const DEFAULT_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  %head%
</head>
<body>
  %body%
</body>
</html>
`;

function attributeToString(attributes: Record<string, string | boolean>) {
  if (Object.keys(attributes).length === 0) {
    return '';
  }

  let attribute = '';

  for (const [key, attr] of Object.entries(attributes)) {
    if (typeof attr === 'boolean') {
      attribute += key;
    } else {
      attribute += `${key}="${attr}"`;
    }

    attribute += ' ';
  }

  return ` ${attribute.trim()}`;
}

function componentToString(components: Record<string, FeComponent>) {
  const elements: string[] = [];

  for (const [key, component] of Object.entries(components)) {
    elements.push(
      `<${key}${attributeToString(component.attributes)}>${
        component.children ?? ''
      }</${key}>`
    );
  }

  return elements.join('');
}

export async function compileBrowserCode(
  scripts: FeScripts,
  options: UserConfig,
  plugins?: Plugin[]
) {
  const random = (Math.random() + 1).toString(36).substring(7);
  const dist = join(options.cwd || process.cwd(), options.dist || '.zely', 'fe');
  const out: Record<string, string> = {};
  const builder = await build({
    entryPoints: scripts.map((script, index) => {
      out[script.target] = join(dist, `${random}${index}.js`);
      return {
        in: script.target,
        out: join(dist, `${random}${index}`),
      };
    }),
    platform: 'browser',
    plugins,

    bundle: true,
    minify: true,
    treeShaking: true,
    write: false,
    splitting: true,

    format: 'esm',
    outdir: dist,
  });

  for (const output of builder.outputFiles) {
    mkdirSync(join(output.path, '..'), { recursive: true });
    writeFileSync(output.path, output.contents);
  }

  return { outputFiles: builder.outputFiles, out };
}

export async function createFrontendPage(
  page: FePageData,
  template?: string,
  options?: UserConfig,
  plugins?: Plugin[]
) {
  const $ = {
    head: componentToString(page.head),
    body: componentToString(page.body),
    script: [],
  };

  if (!options) options = {};

  const { outputFiles: output, out } = await compileBrowserCode(
    page.scripts,
    options || {},
    plugins
  );

  if (!options) options = {};

  const dist = join(options.cwd || process.cwd(), options.dist || '.zely', 'fe');

  for (const [key, value] of Object.entries(out)) {
    const compiled = output.find((v) => v.path === value);
    const scriptConfig = page.scripts.find((v) => v.target === key);

    if (scriptConfig.type === 'insert') {
      $.script.push(
        `<script${attributeToString({
          ...scriptConfig.attributes,
          type: scriptConfig.module ? 'module' : 'text/javascript',
        })})}>/*${key}*/${compiled.text}</script>`
      );
    } else {
      $.script.push(
        `<script${attributeToString({
          ...scriptConfig.attributes,
          type: scriptConfig.module ? 'module' : 'text/javascript',
          src: `/__fe/${relative(dist, compiled.path)}`,
        })}></script>`
      );
    }
  }

  if (!template) template = DEFAULT_TEMPLATE;

  return {
    template: template
      .replace('%head%', `${$.head}${$.script.join('')}`)
      .replace('%body%', $.body),

    $,
    built: out,
  };
}
