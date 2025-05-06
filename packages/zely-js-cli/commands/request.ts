/* eslint-disable no-await-in-loop */
import { createInterface } from 'readline';
import 'colors';
import { error, info } from '@zely-js/logger';
import { getConfig } from '../lib/config';

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '',
    });

    rl.question(question, (input) => {
      rl.close();
      resolve(input);
    });
  });
}

interface RequestOption {
  method: string;
  headers: Record<string, any>;
  body: any;
}

function extractVariableNameFromCall(code) {
  const match = code.match(/set\(([^)]+)\)/);
  return match ? match[1].trim() : null;
}

const status = {
  200: '200'.green,
  404: '404'.yellow,
  500: '500'.red,
};

export async function request(base?: string) {
  let port = 8080;
  const config = await getConfig(process.argv.includes('--serpack'));

  port = config.server?.port || port;

  const baseURL = base || `http://localhost:${port}`;

  console.log(`\n▸ baseURL: ${baseURL.green.bold}\n`);

  const exit = true;
  let requestOption: RequestOption = {
    method: 'get',
    body: {},
    headers: {},
  };
  let requestName: string = null;

  const context = {};

  const getName = () => {
    if (requestName) {
      if (requestName.length > 10) {
        return '(...)'.gray;
      }
      return `(${requestName})`.gray;
    }
    return '';
  };

  try {
    info('checking server... (requesting /)');
    await fetch(baseURL);
  } catch (e) {
    if (e.cause.code === 'ECONNREFUSED') {
      error('Cannot connect server. Please start or restart server. (ECONNREFUSED)');
    }
  }
  console.log();

  while (exit) {
    const input = await prompt(
      `${requestOption.method.toUpperCase().blue.bold}${getName()}> `
    );

    if (input.trim().startsWith('/')) {
      const url = new URL(input.trim(), baseURL);

      try {
        const { method } = requestOption;
        const response = await fetch(url.href, {
          body:
            method.toUpperCase() === 'GET'
              ? undefined
              : JSON.stringify(requestOption?.body || {}),
          headers: requestOption?.headers || {},
          method: requestOption.method,
        });
        const text = await response.text();

        console.log(`${status[response.status] || `${response.status}`.gray} ${text}`);
      } catch (e) {
        error(e.message);
      }
    } else {
      try {
        const output = new Function(
          'ctx',
          `
          with (ctx) {
            let option = null;
            
            function set(opt) {
              if (typeof opt !== "object") return {success:false, message:"Option must be object."}
              option = {
                success: true,
                opt,
              }
            }
            function help() {
              console.log(" - set(option) \\n - save(path) \\n - load(path)")
            }
            ${input}
            return option
          }
          `
        )(context);

        if (output?.success) {
          requestOption = output.opt;
          requestName = extractVariableNameFromCall(input);

          if (typeof requestName !== 'string') requestName = null;
        } else if (output?.message) {
          console.log(output.message);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }
}
