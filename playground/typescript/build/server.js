(function (modules) {
  var __serpack_module_cache__ = {};
  function __serpack_require__(id) {
    if (!id.startsWith('sp:')) return require(id);
    if (__serpack_module_cache__[id.slice(3)])
      return __serpack_module_cache__[id.slice(3)];
    const module = { exports: {} };
    __serpack_module_cache__[id.slice(3)] = '__serpack_module_pending__';
    modules[id.slice(3)].call(
      module.exports,
      __serpack_require__,
      require,
      module,
      module.exports
    );
    __serpack_module_cache__[id.slice(3)] = module.exports;
    return module.exports;
  }
  module.exports = __serpack_require__('sp:0');
})({
  /* D:\zelx\playground\typescript\build\server.js */ 0: function (
    __serpack_require__,
    __non_serpack_require__,
    module,
    exports
  ) {
    'use strict';
    var e = __serpack_require__('sp:1'),
      r = __serpack_require__('sp:2');
    e.__virtuals__ || (e.__virtuals__ = []),
      e.__virtuals__.push(...(r.default || r)),
      (e.cwd = __dirname),
      __serpack_require__('@zely-js/zely')
        .zely(e)
        .then((r) => {
          r.server.listen(e.port || 8080),
            console.log(`server is running on http://localhost:${e.port || 8080}`);
        });
  },
  /* D:\zelx\playground\typescript\build\_config.js */ 1: function (
    __serpack_require__,
    __non_serpack_require__,
    module,
    exports
  ) {
    'use strict';
    var e, t;
    (e = {
      0: function (e, t, r, n) {
        'use strict';
        var o, i;
        Object.defineProperty(n, '__esModule', { value: !0 }),
          Object.defineProperty(n, 'default', {
            enumerable: !0,
            get: function () {
              return d;
            },
          });
        let l = e('@zely-js/core'),
          u = e('@zely-js/zely'),
          s = e('sp:1');
        function a(e, t, r, n, o, i, l) {
          try {
            var u = e[i](l),
              s = u.value;
          } catch (e) {
            r(e);
            return;
          }
          u.done ? t(s) : Promise.resolve(s).then(n, o);
        }
        (0, l.setSender)(
          ((o = function* (e, t, r, n) {
            console.log(`response: ${JSON.stringify(r)} (request: ${e.url})`),
              (0, l.defaultSender)(e, t, r, n);
          }),
          (i = function () {
            var e = this,
              t = arguments;
            return new Promise(function (r, n) {
              var i = o.apply(e, t);
              function l(e) {
                a(i, r, n, l, u, 'next', e);
              }
              function u(e) {
                a(i, r, n, l, u, 'throw', e);
              }
              l(void 0);
            });
          }),
          function (e, t, r, n) {
            return i.apply(this, arguments);
          })
        );
        let d = (0, u.defineConfig)({
          server: { port: 3001 },
          experimental: { useHTML: !0 },
          allowAutoMiddlewares: !0,
          middlewares: [s.bodyMiddleware],
          __virtuals__: [(0, l.createVirtualPage)('main.ts', [(0, l.GET)(() => {})])],
        });
      },
      1: function (e, t, r, n) {
        'use strict';
        Object.defineProperty(n, '__esModule', { value: !0 }),
          Object.defineProperty(n, 'bodyMiddleware', {
            enumerable: !0,
            get: function () {
              return l;
            },
          });
        let o = e('node:module'),
          i = e('node:url');
        (0, i.fileURLToPath)(e('url').pathToFileURL(__filename).toString()),
          (0, i.fileURLToPath)(
            new URL('.', e('url').pathToFileURL(__filename).toString())
          ),
          (0, o.createRequire)(e('url').pathToFileURL(__filename).toString());
        var l = (e, t) => {
          let r = '';
          e.request.on('data', (e) => {
            r += e.toString();
          }),
            e.request.on('end', () => {
              try {
                e.body = JSON.parse(r || '{}');
              } catch (t) {
                e.body = {};
              }
              (e.request.body = e.body), t();
            });
        };
      },
    }),
      (t = {}),
      (module.exports = (function r(n) {
        if (!n.startsWith('sp:')) return require(n);
        if (t[n.slice(3)]) return t[n.slice(3)];
        let o = { exports: {} };
        return (
          (t[n.slice(3)] = '__serpack_module_pending__'),
          e[n.slice(3)].call(o.exports, r, require, o, o.exports),
          (t[n.slice(3)] = o.exports),
          o.exports
        );
      })('sp:0')),
      Object.defineProperty(module.exports, '__serpack_module__', {
        value: !0,
        enumerable: !1,
      });
  },
  /* D:\zelx\playground\typescript\build\_pages.js */ 2: function (
    __serpack_require__,
    __non_serpack_require__,
    module,
    exports
  ) {
    'use strict';
    var e, t;
    (e = {
      0: function (e, t, r, n) {
        'use strict';
        let s, i, o, c;
        var a = e('@zely-js/zely');
        r.exports = [
          a.createVirtualPage('index', (s = e('sp:1')).default || s),
          a.createVirtualPage('[params]/index', (i = e('sp:2')).default || i),
          a.createVirtualPage('[params]/test', (o = e('sp:3')).default || o),
          a.createVirtualPage('_404', (c = e('sp:4')).default || c),
        ];
      },
      1: function (e, t, r, n) {
        'use strict';
        var s, i;
        (s = {
          0: function (e, t, r, n) {
            Object.defineProperty(n, '__esModule', { value: !0 }),
              Object.defineProperty(n, 'default', {
                enumerable: !0,
                get: function () {
                  return i;
                },
              });
            let s = e('@zely-js/core'),
              i = [
                (0, s.ALL)(() => {
                  let e = (0, s.response)({ msg: 'Hello', name: '' }, {});
                  return (e.headers = {}), (e.status = 500), e;
                }),
              ];
          },
        }),
          (i = {}),
          (r.exports = (function e(t) {
            if (!t.startsWith('sp:')) return require(t);
            if (i[t.slice(3)]) return i[t.slice(3)];
            let r = { exports: {} };
            return (
              (i[t.slice(3)] = '__serpack_module_pending__'),
              s[t.slice(3)].call(r.exports, e, require, r, r.exports),
              (i[t.slice(3)] = r.exports),
              r.exports
            );
          })('sp:0')),
          Object.defineProperty(r.exports, '__serpack_module__', {
            value: !0,
            enumerable: !1,
          });
      },
      2: function (e, t, r, n) {
        'use strict';
        function s(e, t, r, n, s, i, o) {
          try {
            var c = e[i](o),
              a = c.value;
          } catch (e) {
            r(e);
            return;
          }
          c.done ? t(a) : Promise.resolve(a).then(n, s);
        }
        function i(e) {
          return function () {
            var t = this,
              r = arguments;
            return new Promise(function (n, i) {
              var o = e.apply(t, r);
              function c(e) {
                s(o, n, i, c, a, 'next', e);
              }
              function a(e) {
                s(o, n, i, c, a, 'throw', e);
              }
              c(void 0);
            });
          };
        }
        let o = e('@zely-js/core'),
          { serverRender: c } = e('segify'),
          a = o.logger;
        var l,
          u,
          p =
            ((l = i(function* (e) {
              let t = '',
                r = `<script>
  $.count = 0;

  function increment() {
    $.count += 1;
  }
</script>

<div>
  <h1>Hello, {{$.params.params}}: {{ $.count }}</h1>
  <button $onclick="increment">Add</button>
</div>
`;
              try {
                t = (yield c(r, { params: e.params })).output
                  .map((e) => e.getText())
                  .join('');
              } catch (e) {
                a.warn(
                  'Error occurred while compiling server-side rendered HTML. ' + e.message
                ),
                  (t = '');
              }
              return t;
            })),
            function (e) {
              return l.apply(this, arguments);
            });
        r.exports = [
          o.GET(
            ((u = i(function* (e) {
              return e.html(
                `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module">/*[params]\\index.html*/var p=(n,e,s=[],c={})=>{e.children=[].concat(...s);for(let $ in e)if(Array.isArray(e[$])&&e[$].length===2&&Array.isArray(e[$][0])&&typeof e[$][1]=="string"){let[i,o]=e[$];for(let l of i)o=o.replace(l,c[l]());e[$]=o}let r=new n(e),t=r.$components();return r.$stylesheet(),r.$event(),t},a=(n,e,s=[],c={})=>{if(typeof n!="string")return p(n,e,s,c);let r=document.createElement(n);for(let t in e)if(Array.isArray(e[t])){let[$,i]=e[t];for(let o of $)i=i.replace(o,c[o]());r.setAttribute(t,i)}else r.setAttribute(t,e[t]);for(let t of s)Array.isArray(t)&&t.forEach($=>{r.appendChild($)}),f(t)&&r.appendChild(t);return r},u=n=>document.createTextNode(n),d=(n,e=!0,s=[])=>{let c=$=>Array.isArray($)?$:[$],r=n();if(Array.isArray(r))return c(r);let t=document.createTextNode(r);return e&&s.push([t,n]),c(t)};function f(n){return window.__env__==="ssr"?n?.__component__:n instanceof Element||n instanceof HTMLDocument||n instanceof Text}var _=(n,e,s)=>(n&&(n=s),e&&e(s),s);window.$$={$cc:p,$ce:a,$ct:u,$cd:d,$isElement:f,$mount:_};var h=class{$subscribe=[];constructor(e){var s=[],c=[],r=new Proxy({__props__:{}},{set(t,$,i){t[$]=i;for(let o of s)o[0].nodeValue=o[1]();return!0}});Object.keys(e).forEach(t=>r[t]=e[t]),this.$=r,this.$events=c,this.$subscribe=s}$kill(){this.$events.forEach(e=>e[1].removeEventListener(e[0],e[2]))}$components(){let{$:e,$events:s,$subscribe:c}=this;var r={$0$:()=>e.params.params,$1$:()=>e.count};this.$DEV_PROPS=r,e.count=0;function t(){e.count+=1}return[a("div",{},[a("h1",{},[u("Hello, "),...d(r.$0$,!0,this.$subscribe),u(": "),...d(r.$1$,!0,this.$subscribe)],this.$DEV_PROPS),s.push(["click",a("button",{},[u("Add")],this.$DEV_PROPS),t])&&s[s.length-1][1]],this.$DEV_PROPS)]}$stylesheet(){var e=document.createElement("style");return e.innerHTML="",e}$event(){this.$events.forEach(e=>e[1].addEventListener(e[0],e[2]))}render(e){document.head.appendChild(this.$stylesheet()),[].concat(...this.$components()).filter(f).forEach(s=>e.appendChild(s)),this.$event()}};var y=JSON.parse(document.getElementById("__fe_props").innerText);document.getElementById("__fe").innerHTML="";var m=new h(y);m.render(document.getElementById("__fe"));export{h as Component,h as default};
</script>
</head>
<body>
  <div id="__fe">%ssr%</div><script id="__fe_props" type="application/json">%props%</script>
</body>
</html>
`
                  .replace('%ssr%', yield p(e))
                  .replace('%props%', JSON.stringify({ params: e.params }))
              );
            })),
            function (e) {
              return u.apply(this, arguments);
            })
          ),
        ];
      },
      3: function (e, t, r, n) {
        'use strict';
        var s, i;
        (s = {
          0: function (e, t, r, n) {
            Object.defineProperty(n, '__esModule', { value: !0 }),
              Object.defineProperty(n, 'default', {
                enumerable: !0,
                get: function () {
                  return s;
                },
              });
            let s = [(0, e('@zely-js/zely').ALL)({ id: 1214, nickname: '' })];
          },
        }),
          (i = {}),
          (r.exports = (function e(t) {
            if (!t.startsWith('sp:')) return require(t);
            if (i[t.slice(3)]) return i[t.slice(3)];
            let r = { exports: {} };
            return (
              (i[t.slice(3)] = '__serpack_module_pending__'),
              s[t.slice(3)].call(r.exports, e, require, r, r.exports),
              (i[t.slice(3)] = r.exports),
              r.exports
            );
          })('sp:0')),
          Object.defineProperty(r.exports, '__serpack_module__', {
            value: !0,
            enumerable: !1,
          });
      },
      4: function (e, t, r, n) {
        'use strict';
        var s, i;
        (s = {
          0: function (e, t, r, n) {
            Object.defineProperty(n, '__esModule', { value: !0 }),
              Object.defineProperty(n, 'default', {
                enumerable: !0,
                get: function () {
                  return s;
                },
              });
            let s = [
              (0, e('@zely-js/core').GET)((e) => {
                e.status(404).send({ error: `${e.pathname} not found`, code: 404 });
              }),
            ];
          },
        }),
          (i = {}),
          (r.exports = (function e(t) {
            if (!t.startsWith('sp:')) return require(t);
            if (i[t.slice(3)]) return i[t.slice(3)];
            let r = { exports: {} };
            return (
              (i[t.slice(3)] = '__serpack_module_pending__'),
              s[t.slice(3)].call(r.exports, e, require, r, r.exports),
              (i[t.slice(3)] = r.exports),
              r.exports
            );
          })('sp:0')),
          Object.defineProperty(r.exports, '__serpack_module__', {
            value: !0,
            enumerable: !1,
          });
      },
    }),
      (t = {}),
      (module.exports = (function r(n) {
        if (!n.startsWith('sp:')) return require(n);
        if (t[n.slice(3)]) return t[n.slice(3)];
        let s = { exports: {} };
        return (
          (t[n.slice(3)] = '__serpack_module_pending__'),
          e[n.slice(3)].call(s.exports, r, require, s, s.exports),
          (t[n.slice(3)] = s.exports),
          s.exports
        );
      })('sp:0')),
      Object.defineProperty(module.exports, '__serpack_module__', {
        value: !0,
        enumerable: !1,
      });
  },
});
Object.defineProperty(module.exports, '__serpack_module__', {
  value: true,
  enumerable: false,
});
undefined;
