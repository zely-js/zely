import readline from 'node:readline';
import 'colors';

const stream = process.stdout;
const defaultSpinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(
  (item) => item.cyan
);

interface SpinnerOptions {
  spinner?: string[];
  tick?: number;
  message?: string;
}

class Spinner {
  tick: number;

  spinner: string[];

  message: string;

  processor: NodeJS.Timer;

  constructor(opts: SpinnerOptions = {}) {
    this.tick = opts.tick || 50;
    this.spinner = opts.spinner || defaultSpinner;
    this.message = opts.message || '';
  }

  clearLine(): this {
    readline.clearLine(stream, 0);
    readline.cursorTo(stream, 0);

    return this;
  }

  start(): this {
    let index = 0;

    this.processor = setInterval(() => {
      this.clearLine();
      stream.write(`${this.spinner[index % this.spinner.length]} ${this.message}`);
      index += 1;
    }, this.tick);

    return this;
  }

  stop(message: string = ''): this {
    if (this.processor) {
      clearInterval(this.processor);
      this.clearLine();
      stream.write(message);
    }

    return this;
  }

  edit(message: string): this {
    this.message = message;

    return this;
  }
}

function spinner(options?: SpinnerOptions) {
  return new Spinner(options);
}

export { Spinner, spinner, SpinnerOptions };
