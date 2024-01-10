import 'colors';

function transform(t: number): string {
  let time = String(t);

  if (time.length === 1) {
    time = `0${time}`;
  }

  return time;
}

function getTime() {
  const date = new Date();

  const hours = transform(date.getHours() % 12 ? date.getHours() % 12 : 12);
  const min = transform(date.getMinutes());
  const sec = transform(date.getSeconds());
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

  return `[${hours}:${min}:${sec} ${ampm}]`;
}

const tab = '  ';

function parseError(err: Error) {
  const st = err.stack?.split('\n').slice(1);
  return st?.map((stack) => {
    stack = stack.slice(7);
    const $ = {
      at: '',
      loc: '',
    };

    $.loc = (/\([^)]*\)/.exec(stack) || [])[0] || '';
    $.at = stack.replace($.loc, '');

    return $;
  });
}

function error(err: Error | string) {
  if (typeof err === 'string') {
    console.log(`${getTime().gray} ${'error'.red.bold} ${err.bold}`);
  } else {
    const stacks = parseError(err);

    console.log(
      `\n${getTime().gray} ${' ERROR '.bgRed.black.bold} ${err.message.bold}\n`
    );

    stacks?.forEach((stack) => {
      console.log(`${tab}${'at'.gray} ${stack.at}${stack.loc.cyan}`);
    });
    console.log();
  }
}

function errorWithStacks(
  err: string,
  stacks: {
    at: string;
    loc: string;
  }[]
) {
  console.log(`\n${getTime().gray} ${' ERROR '.bgRed.black.bold} ${err.bold}\n`);

  stacks?.forEach((stack) => {
    console.log(`${tab}${'at'.gray} ${stack.at}${stack.loc.cyan}`);
  });
  console.log();
}

function warn(message: string) {
  console.log(`${getTime().gray} ${'warning'.yellow.bold} ${message.bold}`);
}

function success(message: string, type: string = 'success') {
  console.log(`${getTime().gray} ${type.green.bold} ${message.bold}`);
}

function info(message: string) {
  console.log(`${getTime().gray} ${'info'.blue.bold} ${message.bold}`);
}

export { success, info, error, warn, parseError, errorWithStacks };
