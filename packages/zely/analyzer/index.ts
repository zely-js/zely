import 'colors';
import { join, normalize, relative } from 'path';
import { readdirSync, statSync } from 'fs';
import * as zely from '$zely';

function clean(path: string) {
  path = normalize(path);
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }
  return path;
}

async function core() {
  const config = await zely.getConfig();

  const pages = await zely.getPages(config);
  const routes = await zely.filenameToRoute(pages);

  console.log('');

  pages.forEach((page, index) => {
    const sliced = relative(process.cwd(), routes[index].modulePath)
      .replace(/\\/g, '/')
      .split('/');
    console.log(
      `${`${index + 1}.`.cyan} ${`${clean(config.routes || '/pages/')}`.grey}${
        page.file.replace(/\\/g, '/').bold
      } => ${routes[index].file.green} ${
        `(${sliced.slice(0, -1).join('/').dim}/pages/${sliced[sliced.length - 1].bold})`
          .yellow
      }`
    );
  });

  let sized = 0;

  readdirSync(zely.CACHE_DIRECTORY).forEach((f) => {
    const { size } = statSync(join(zely.CACHE_DIRECTORY, f));

    sized += size;
  });

  console.log('\n_____ RESULT _____\n');
  console.log(`Dist Directory - ${zely.CACHE_DIRECTORY.grey}`);
  console.log(`Cache File - ${zely.CACHE_FILE.grey}`);
  console.log(`Size - ${`${sized} byte`.grey}`);

  console.log('');
  console.log(`${String(pages.length).green.bold} pages found.\n`);
}

export { core };
