import { box } from 'teeti';
import 'colors';

import pkg from '../package.json';

export function showListen(port: number | string) {
  console.log(`${'$'.gray} ${`zely@${pkg.version}`.yellow}`);

  console.log();
  const result = box(
    (
      [
        'Server is Running on '.green + port.toString().gray.bold + '.'.green,
        '',
        `http://localhost:${String(port).cyan}`.bold,
        `http://127.0.0.1:${String(port).cyan}`.bold,
      ] as any
    ).join('\n'),
    {
      paddingLeftRight: 12,
      paddingTopBottom: 1,
      marginLeft: 2,
      textAlign: 'center',
      title: 'server'.cyan,
      titleAlign: 'left',
      titlePadding: 2,
      style: {
        topLeft: '╭'.gray,
        topRight: '╮'.gray,
        bottomLeft: '╰'.gray,
        bottomRight: '╯'.gray,
        left: '│'.gray,
        right: '│'.gray,
        top: '─'.gray,
        bottom: '─'.gray,
      },
    }
  );

  console.log(result);

  console.log();
}
