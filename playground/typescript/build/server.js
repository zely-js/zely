;/*store_helpers*/var {$store,$access}=require("@zely-js/core");
(function(modules) {
  var __serpack_module_cache__={};
  function __serpack_require__(id){
    if (!id.startsWith("sp:")) return require(id);
    if (__serpack_module_cache__[id.slice(3)]) return __serpack_module_cache__[id.slice(3)];
    const module={exports:{}};
    __serpack_module_cache__[id.slice(3)]="__serpack_module_pending__";
    modules[id.slice(3)].call(module.exports, __serpack_require__, require, module, module.exports);
    __serpack_module_cache__[id.slice(3)]=module.exports;
    return module.exports;
  }
  module.exports=__serpack_require__("sp:0");
})({
/* D:\zelx\playground\typescript\build\server.js */ "0": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e = __serpack_require__("./_config.js"), r = __serpack_require__("./_pages.js");
(e.__virtuals__ || (e.__virtuals__ = []), e.__virtuals__.push(...r.default || r), e.cwd = __dirname, __serpack_require__("@zely-js/zely").zely(e).then(r => {
  (r.server.listen(e.port || 8080), console.log(`server is running on http://localhost:${e.port || 8080}`));
}));
 }),
/* D:\zelx\playground\typescript\build\_config.js */ "1": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r, {$store: t, $access: n} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, r, t, n) {
    var o, l;
    (Object.defineProperty(n, "__esModule", {
      value: !0
    }), Object.defineProperty(n, "default", {
      enumerable: !0,
      get: function () {
        return d;
      }
    }));
    let i = e("@zely-js/core"), u = e("@zely-js/zely"), a = e("@zely-js/zely/middlewares");
    function s(e, r, t, n, o, l, i) {
      try {
        var u = e[l](i), a = u.value;
      } catch (e) {
        t(e);
        return;
      }
      u.done ? r(a) : Promise.resolve(a).then(n, o);
    }
    ((0, i.setSender))(((o = function* (e, r, t, n) {
      ((0, i.defaultSender))(e, r, t, n);
    }, l = function () {
      var e = this, r = arguments;
      return new Promise(function (t, n) {
        var l = o.apply(e, r);
        function i(e) {
          s(l, t, n, i, u, "next", e);
        }
        function u(e) {
          s(l, t, n, i, u, "throw", e);
        }
        i(void 0);
      });
    }, function (e, r, t, n) {
      return l.apply(this, arguments);
    })));
    let d = ((0, u.defineConfig))({
      server: {
        port: 3001
      },
      experimental: {
        useHTML: !0
      },
      allowAutoMiddlewares: !0,
      middlewares: [a.bodyMiddleware],
      __virtuals__: [((0, i.createVirtualPage))('main.ts', [((0, i.GET))(() => {})])]
    });
  },
  1: function (e, r, t, n) {
    (Object.defineProperty(n, "__esModule", {
      value: !0
    }), Object.defineProperty(n, "bodyMiddleware", {
      enumerable: !0,
      get: function () {
        return i;
      }
    }));
    let o = e("node:module"), l = e("node:url");
    (((0, l.fileURLToPath))(e("url").pathToFileURL(__filename).toString()), ((0, l.fileURLToPath))(new URL(".", e("url").pathToFileURL(__filename).toString())), ((0, o.createRequire))(e("url").pathToFileURL(__filename).toString()));
    var i = (e, r) => {
      let t = "";
      (e.request.on("data", e => {
        t += e.toString();
      }), e.request.on("end", () => {
        try {
          e.body = JSON.parse(t || "{}");
        } catch (r) {
          e.body = {};
        }
        (e.request.body = e.body, r());
      }));
    };
  }
}, r = {}, module.exports = (function t(n) {
  if (!n.startsWith("sp:")) return require(n);
  if (r[n.slice(3)]) return r[n.slice(3)];
  let o = {
    exports: {}
  };
  return (r[n.slice(3)] = "__serpack_module_pending__", e[n.slice(3)].call(o.exports, t, require, o, o.exports), r[n.slice(3)] = o.exports, o.exports);
})("sp:0"), Object.defineProperty(module.exports, "__serpack_module__", {
  value: !0,
  enumerable: !1
}));
 }),
/* D:\zelx\playground\typescript\build\_pages.js */ "2": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, t, {$store: r, $access: n} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, t, r, n) {
    let s, i, o, a;
    var c = e("@zely-js/zely");
    r.exports = [c.createVirtualPage("index", (s = e("./page/index49.js")).default || s), c.createVirtualPage("[params]/index", (i = e("./fe/generated/index.ukk5l.js")).default || i), c.createVirtualPage("[params]/test", (o = e("./page/[params]/test325.js")).default || o), c.createVirtualPage("_404", (a = e("./page/_40422.js")).default || a)];
  },
  1: function (e, t, r, n) {
    var s, i, {$store: o, $access: a} = e("@zely-js/core");
    (s = {
      0: function (e, t, r, n) {
        var s, i;
        function o(e, t, r, n, s, i, o) {
          try {
            var a = e[i](o), c = a.value;
          } catch (e) {
            r(e);
            return;
          }
          a.done ? t(c) : Promise.resolve(c).then(n, s);
        }
        (Object.defineProperty(n, "__esModule", {
          value: !0
        }), Object.defineProperty(n, "default", {
          enumerable: !0,
          get: function () {
            return a;
          }
        }));
        let a = [((0, e("@zely-js/core").ALL))(((s = function* (e) {
          e.debug('Meeessage');
        }, i = function () {
          var e = this, t = arguments;
          return new Promise(function (r, n) {
            var i = s.apply(e, t);
            function a(e) {
              o(i, r, n, a, c, "next", e);
            }
            function c(e) {
              o(i, r, n, a, c, "throw", e);
            }
            a(void 0);
          });
        }, function (e) {
          return i.apply(this, arguments);
        })))];
      }
    }, i = {}, r.exports = (function e(t) {
      if (!t.startsWith("sp:")) return require(t);
      if (i[t.slice(3)]) return i[t.slice(3)];
      let r = {
        exports: {}
      };
      return (i[t.slice(3)] = "__serpack_module_pending__", s[t.slice(3)].call(r.exports, e, require, r, r.exports), i[t.slice(3)] = r.exports, r.exports);
    })("sp:0"), Object.defineProperty(r.exports, "__serpack_module__", {
      value: !0,
      enumerable: !1
    }));
  },
  2: function (e, t, r, n) {
    function s(e, t, r, n, s, i, o) {
      try {
        var a = e[i](o), c = a.value;
      } catch (e) {
        r(e);
        return;
      }
      a.done ? t(c) : Promise.resolve(c).then(n, s);
    }
    function i(e) {
      return function () {
        var t = this, r = arguments;
        return new Promise(function (n, i) {
          var o = e.apply(t, r);
          function a(e) {
            s(o, n, i, a, c, "next", e);
          }
          function c(e) {
            s(o, n, i, a, c, "throw", e);
          }
          a(void 0);
        });
      };
    }
    let o = e("@zely-js/core"), {serverRender: a} = e("segify");
    o.logger;
    var c, u, l = ((c = i(function* (e) {
      let t = '', r = `<script>
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
        t = (yield a(r, {
          params: e.params
        })).output.map(e => e.getText()).join('');
      } catch (e) {
        t = "";
      }
      return t;
    }), function (e) {
      return c.apply(this, arguments);
    }));
    r.exports = [o.GET(((u = i(function* (e) {
      return e.html(`
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
`.replace("%ssr%", (yield l(e))).replace("%props%", JSON.stringify({
        params: e.params
      })));
    }), function (e) {
      return u.apply(this, arguments);
    })))];
  },
  3: function (e, t, r, n) {
    var s, i, {$store: o, $access: a} = e("@zely-js/core");
    (s = {
      0: function (e, t, r, n) {
        var s;
        (Object.defineProperty(n, "__esModule", {
          value: !0
        }), Object.defineProperty(n, "default", {
          enumerable: !0,
          get: function () {
            return l;
          }
        }));
        let i = e("@zely-js/core"), a = e("timers/promises");
        function c(e, t, r, n, s, i, o) {
          try {
            var a = e[i](o), c = a.value;
          } catch (e) {
            r(e);
            return;
          }
          a.done ? t(c) : Promise.resolve(c).then(n, s);
        }
        function u(e) {
          return function () {
            var t = this, r = arguments;
            return new Promise(function (n, s) {
              var i = e.apply(t, r);
              function o(e) {
                c(i, n, s, o, a, "next", e);
              }
              function a(e) {
                c(i, n, s, o, a, "throw", e);
              }
              o(void 0);
            });
          };
        }
        let l = [((0, i.ALL))(((s = u(function* (e) {
          let {data: t} = yield o(u(function* () {
            return (yield ((0, a.setTimeout))(1000), `Hello ${e.params.params}!`);
          }), [e.params.params], "pages\[params]\test.ts-899");
          return t || 'null';
        }), function (e) {
          return s.apply(this, arguments);
        })))];
      }
    }, i = {}, r.exports = (function e(t) {
      if (!t.startsWith("sp:")) return require(t);
      if (i[t.slice(3)]) return i[t.slice(3)];
      let r = {
        exports: {}
      };
      return (i[t.slice(3)] = "__serpack_module_pending__", s[t.slice(3)].call(r.exports, e, require, r, r.exports), i[t.slice(3)] = r.exports, r.exports);
    })("sp:0"), Object.defineProperty(r.exports, "__serpack_module__", {
      value: !0,
      enumerable: !1
    }));
  },
  4: function (e, t, r, n) {
    var s, i, {$store: o, $access: a} = e("@zely-js/core");
    (s = {
      0: function (e, t, r, n) {
        (Object.defineProperty(n, "__esModule", {
          value: !0
        }), Object.defineProperty(n, "default", {
          enumerable: !0,
          get: function () {
            return s;
          }
        }));
        let s = [((0, e("@zely-js/core").GET))(e => {
          e.status(404).send({
            error: `${e.pathname} not found`,
            code: 404
          });
        })];
      }
    }, i = {}, r.exports = (function e(t) {
      if (!t.startsWith("sp:")) return require(t);
      if (i[t.slice(3)]) return i[t.slice(3)];
      let r = {
        exports: {}
      };
      return (i[t.slice(3)] = "__serpack_module_pending__", s[t.slice(3)].call(r.exports, e, require, r, r.exports), i[t.slice(3)] = r.exports, r.exports);
    })("sp:0"), Object.defineProperty(r.exports, "__serpack_module__", {
      value: !0,
      enumerable: !1
    }));
  }
}, t = {}, module.exports = (function r(n) {
  if (!n.startsWith("sp:")) return require(n);
  if (t[n.slice(3)]) return t[n.slice(3)];
  let s = {
    exports: {}
  };
  return (t[n.slice(3)] = "__serpack_module_pending__", e[n.slice(3)].call(s.exports, r, require, s, s.exports), t[n.slice(3)] = s.exports, s.exports);
})("sp:0"), Object.defineProperty(module.exports, "__serpack_module__", {
  value: !0,
  enumerable: !1
}));
 }),
});
Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});