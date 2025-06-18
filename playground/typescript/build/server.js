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
/* D:\zelx\playground\typescript\build\server.js */ "0": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e = __serpack_require__('sp:1'), r = __serpack_require__('sp:2'), s = __serpack_require__('sp:3');
(e.__virtuals__ || (e.__virtuals__ = []), e.middlewares || (e.middlewares = []), e.__virtuals__.push(...r.default || r), e.middlewares.push(...s.default || s), e.cwd = __dirname, __serpack_require__("@zely-js/zely").zely(e).then(r => {
  (r.server.listen(e.port || 8080), console.log(`server is running on http://localhost:${e.port || 8080}`));
}));
 }),
/* D:\zelx\playground\typescript\build\_config.js */ "1": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r, {$store: t, $access: n} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, r, t, n) {
    var o, i;
    (Object.defineProperty(n, "__esModule", {
      value: !0
    }), Object.defineProperty(n, "default", {
      enumerable: !0,
      get: function () {
        return d;
      }
    }));
    let l = e("@zely-js/core"), u = e("@zely-js/zely"), a = e('sp:1');
    function s(e, r, t, n, o, i, l) {
      try {
        var u = e[i](l), a = u.value;
      } catch (e) {
        t(e);
        return;
      }
      u.done ? r(a) : Promise.resolve(a).then(n, o);
    }
    ((0, l.setSender))(((o = function* (e, r, t, n) {
      ((0, l.defaultSender))(e, r, t, n);
    }, i = function () {
      var e = this, r = arguments;
      return new Promise(function (t, n) {
        var i = o.apply(e, r);
        function l(e) {
          s(i, t, n, l, u, "next", e);
        }
        function u(e) {
          s(i, t, n, l, u, "throw", e);
        }
        l(void 0);
      });
    }, function (e, r, t, n) {
      return i.apply(this, arguments);
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
      __virtuals__: [((0, l.createVirtualPage))('main.ts', [((0, l.GET))(() => {})])]
    });
  },
  1: function (e, r, t, n) {
    (Object.defineProperty(n, "__esModule", {
      value: !0
    }), Object.defineProperty(n, "bodyMiddleware", {
      enumerable: !0,
      get: function () {
        return l;
      }
    }));
    let o = e("node:module"), i = e("node:url");
    (((0, i.fileURLToPath))(e("url").pathToFileURL(__filename).toString()), ((0, i.fileURLToPath))(new URL(".", e("url").pathToFileURL(__filename).toString())), ((0, o.createRequire))(e("url").pathToFileURL(__filename).toString()));
    var l = (e, r) => {
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
/* D:\zelx\playground\typescript\build\_pages.js */ "2": (function(__serpack_require__,__non_serpack_require__,module,exports) { let e, a, r, t;
var i = __serpack_require__("@zely-js/zely");
module.exports = [i.createVirtualPage("index", (e = __serpack_require__('sp:4')).default || e), i.createVirtualPage("[params]/index", (a = __serpack_require__('sp:5')).default || a), i.createVirtualPage("[params]/test", (r = __serpack_require__('sp:6')).default || r), i.createVirtualPage("_404", (t = __serpack_require__('sp:7')).default || t)];
 }),
/* D:\zelx\playground\typescript\build\page\index940.js */ "4": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r, {$store: t, $access: n} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, r, t, n) {
    var o, u;
    function i(e, r, t, n, o, u, i) {
      try {
        var s = e[u](i), c = s.value;
      } catch (e) {
        t(e);
        return;
      }
      s.done ? r(c) : Promise.resolve(c).then(n, o);
    }
    (Object.defineProperty(n, "__esModule", {
      value: !0
    }), Object.defineProperty(n, "default", {
      enumerable: !0,
      get: function () {
        return s;
      }
    }));
    let s = [((0, e("@zely-js/core").ALL))(((o = function* (e) {
      e.debug('Meeessage');
    }, u = function () {
      var e = this, r = arguments;
      return new Promise(function (t, n) {
        var u = o.apply(e, r);
        function s(e) {
          i(u, t, n, s, c, "next", e);
        }
        function c(e) {
          i(u, t, n, s, c, "throw", e);
        }
        s(void 0);
      });
    }, function (e) {
      return u.apply(this, arguments);
    })))];
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
/* D:\zelx\playground\typescript\build\fe\generated\index.miyjy.js */ "5": (function(__serpack_require__,__non_serpack_require__,module,exports) { function e(e, t, r, n, s, i, o) {
  try {
    var c = e[i](o), a = c.value;
  } catch (e) {
    r(e);
    return;
  }
  c.done ? t(a) : Promise.resolve(a).then(n, s);
}
function t(t) {
  return function () {
    var r = this, n = arguments;
    return new Promise(function (s, i) {
      var o = t.apply(r, n);
      function c(t) {
        e(o, s, i, c, a, "next", t);
      }
      function a(t) {
        e(o, s, i, c, a, "throw", t);
      }
      c(void 0);
    });
  };
}
const r = __serpack_require__("@zely-js/core"), {serverRender: n} = __serpack_require__("segify");
r.logger;
var s, i, o = ((s = t(function* (e) {
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
    t = (yield n(r, {
      params: e.params
    })).output.map(e => e.getText()).join('');
  } catch (e) {
    t = "";
  }
  return t;
}), function (e) {
  return s.apply(this, arguments);
}));
module.exports = [r.GET(((i = t(function* (e) {
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
`.replace("%ssr%", (yield o(e))).replace("%props%", JSON.stringify({
    params: e.params
  })));
}), function (e) {
  return i.apply(this, arguments);
})))];
 }),
/* D:\zelx\playground\typescript\build\page\[params]\test706.js */ "6": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r, {$store: t, $access: n} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, r, n, o) {
    var s;
    (Object.defineProperty(o, "__esModule", {
      value: !0
    }), Object.defineProperty(o, "default", {
      enumerable: !0,
      get: function () {
        return c;
      }
    }));
    let u = e("@zely-js/core"), i = e("timers/promises");
    function l(e, r, t, n, o, s, u) {
      try {
        var i = e[s](u), l = i.value;
      } catch (e) {
        t(e);
        return;
      }
      i.done ? r(l) : Promise.resolve(l).then(n, o);
    }
    function a(e) {
      return function () {
        var r = this, t = arguments;
        return new Promise(function (n, o) {
          var s = e.apply(r, t);
          function u(e) {
            l(s, n, o, u, i, "next", e);
          }
          function i(e) {
            l(s, n, o, u, i, "throw", e);
          }
          u(void 0);
        });
      };
    }
    let c = [((0, u.ALL))(((s = a(function* (e) {
      let {data: r} = yield t(a(function* () {
        return (yield ((0, i.setTimeout))(1000), `Hello ${e.params.params}!`);
      }), [e.params.params], "pages\[params]\test.ts-899");
      return r || 'null';
    }), function (e) {
      return s.apply(this, arguments);
    })))];
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
/* D:\zelx\playground\typescript\build\page\_404806.js */ "7": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r, {$store: t, $access: o} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, r, t, o) {
    (Object.defineProperty(o, "__esModule", {
      value: !0
    }), Object.defineProperty(o, "default", {
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
}, r = {}, module.exports = (function t(o) {
  if (!o.startsWith("sp:")) return require(o);
  if (r[o.slice(3)]) return r[o.slice(3)];
  let s = {
    exports: {}
  };
  return (r[o.slice(3)] = "__serpack_module_pending__", e[o.slice(3)].call(s.exports, t, require, s, s.exports), r[o.slice(3)] = s.exports, s.exports);
})("sp:0"), Object.defineProperty(module.exports, "__serpack_module__", {
  value: !0,
  enumerable: !1
}));
 }),
/* D:\zelx\playground\typescript\build\_middlewares.js */ "3": (function(__serpack_require__,__non_serpack_require__,module,exports) { let e;
module.exports = [(e = __serpack_require__('sp:8')).default || e];
 }),
/* D:\zelx\playground\typescript\build\middleware\index341.js.js */ "8": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r, {$store: t, $access: o} = __serpack_require__("@zely-js/core");
(e = {
  0: function (e, r, t, o) {
    function s(e, r) {
      (console.log(Object.keys(e)), r());
    }
    (Object.defineProperty(o, "__esModule", {
      value: !0
    }), Object.defineProperty(o, "default", {
      enumerable: !0,
      get: function () {
        return s;
      }
    }));
  }
}, r = {}, module.exports = (function t(o) {
  if (!o.startsWith("sp:")) return require(o);
  if (r[o.slice(3)]) return r[o.slice(3)];
  let s = {
    exports: {}
  };
  return (r[o.slice(3)] = "__serpack_module_pending__", e[o.slice(3)].call(s.exports, t, require, s, s.exports), r[o.slice(3)] = s.exports, s.exports);
})("sp:0"), Object.defineProperty(module.exports, "__serpack_module__", {
  value: !0,
  enumerable: !1
}));
 }),
});
Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});