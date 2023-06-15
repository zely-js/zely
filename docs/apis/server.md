# Server Api

Zely is running on osik which was made for speed and weight.

If you want information of [osik](https://www.npmjs.com/package/osik), visit [here](/apis/osik).

## Zely()

It creates a core server.

```ts
import { Zely } from 'zely';

const server = await Zely({
  /* config */
});

// middleware

server.use((req, res, next) => {
  next();
});

server.listen(3000, () => {});
```
