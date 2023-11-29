import { readFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { SourceMapConsumer } from 'source-map';
import { CACHE_DIRECTORY } from '../constants';
import { parseError, errorWithStacks } from '../logger';

const errorHandler = async (e) => {
  if (!e) return;
  if (process.env.NODE_ENV === 'production') {
    throw new Error(e);
  }

  const stacks = parseError(e);
  const occured = stacks[0].loc.slice(1, -1);
  const sliced = occured.split(':');

  const column = sliced.pop();
  const line = sliced.pop();

  const trace = {
    filename: occured,
    line: Number(line),
    column: Number(column),
  };
  const tracer = JSON.parse(readFileSync(join(CACHE_DIRECTORY, 'tracer'), 'utf-8'));

  if (!tracer[`${sliced.join(':').replace(/\\/g, '/')}.map`]) {
    errorWithStacks(e.message, stacks);
    return;
  }

  const sourcemap = new SourceMapConsumer(
    JSON.parse(tracer[`${sliced.join(':').replace(/\\/g, '/')}.map`])
  );

  const result = (await sourcemap).originalPositionFor(trace);
  const target = join(dirname(sliced.join(':')), result.source);

  stacks.unshift({
    at: '',
    loc: `${target}:${result.line}:${result.column}`,
  });

  errorWithStacks(e.message, stacks);

  const errorFile = readFileSync(target, 'utf-8').split('\n');
  const errorLine = errorFile[result.line - 1];

  console.log(
    `${relative(process.cwd(), target)}:${result.line}:${result.column}`.yellow.dim
  );

  if (result.line - 1 > 0) {
    console.log(`${`${result.line - 1} | `.gray}${errorFile[result.line - 2]}`);
  }
  console.log(
    `${`${result.line} | `.gray}${errorLine.slice(0, result.column - 2)}${
      errorLine.slice(result.column - 2, result.column + 2).underline.red
    }${errorLine.slice(result.column + +2)}`
  );
  if (errorFile[result.line]) {
    console.log(`${`${result.line + 1} | `.gray}${errorFile[result.line]}`);
  }
};

export { errorHandler };
