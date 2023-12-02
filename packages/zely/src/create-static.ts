import { writeFileSync } from 'fs';
import { join } from 'path';
import { FileData } from './config';
import { error } from './logger';
import { Spinner } from './spinner';
import { CACHE_DIRECTORY } from './constants';

export async function createStatic(files: FileData[]) {
  const props: Record<string, object> = {};

  console.log();

  const staticPropsFuncs = files.filter((file) => {
    if (file.type === 'html') {
      return false;
    }

    // @ts-ignore
    const staticProps = file.m?.staticProps || file.m?.default?.staticProps;

    if (!staticProps) return false;

    if (typeof staticProps !== 'function') {
      error('staticProps must be function');

      process.exit(1);
    }

    return true;
  });

  if (staticPropsFuncs.length === 0) {
    return;
  }

  const spinner = new Spinner({});
  spinner.edit('generating static props... 0%');

  spinner.start();

  for await (const [index, file] of staticPropsFuncs.entries()) {
    // @ts-ignore
    const staticProps = file.m.staticProps || file.m.default.staticProps;

    const pageProps: { props: any } = await staticProps();

    props[file.file] = pageProps?.props || {};

    spinner.edit(
      `generating static props... ${(100 * (index / staticPropsFuncs.length)).toFixed()}%`
    );
  }

  writeFileSync(join(CACHE_DIRECTORY, 'static'), JSON.stringify(props));

  spinner.stop(
    `${'✓'.green} static props generated ${'('.gray}${
      `${staticPropsFuncs.length}`.cyan
    } ${'pages)\n'.gray}`
  );

  console.log();

  return props;
}
