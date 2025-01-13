import { parseError, errorWithStacks } from '@zely-js/logger';
import { SourceMapConsumer } from 'source-map';
import { readFileSync, existsSync } from 'fs';
import { dirname, join, relative } from 'path';

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
  const targetFile = `${sliced.join(':').replace(/\\/g, '/')}.map`;

  if (!existsSync(targetFile)) {
    errorWithStacks(e.message, stacks);
    return;
  }

  const tracer = JSON.parse(readFileSync(targetFile, 'utf-8'));

  if (tracer.sections) {
    // indexed map
    // TODO

    errorWithStacks(e.message, stacks);
    return;
  }

  const sourcemap = new SourceMapConsumer(tracer);

  const result = (await sourcemap).originalPositionFor(trace);
  const target = join(dirname(sliced.join(':')), result.source);

  stacks.unshift({
    at: '',
    loc: `${target}:${result.line}:${result.column}`,
  });

  // errorWithStacks(e.message, stacks);

  const lines = [];

  const errorFile = readFileSync(target, 'utf-8').split('\n');

  lines.push(
    `${relative(process.cwd(), target)}:${result.line}:${result.column}`.yellow.dim
  );

  if (result.line - 1 > 0) {
    lines.push(`${`${result.line - 1} | `.gray}${errorFile[result.line - 2]}`);
  }
  lines.push(`${`${result.line} | `.gray}${errorFile[result.line - 1].red.underline}`);
  if (errorFile[result.line]) {
    lines.push(`${`${result.line + 1} | `.gray}${errorFile[result.line]}`);
  }

  errorWithStacks(`${e.message}\n${lines.join('\n')}`, stacks);
};

export default errorHandler;
