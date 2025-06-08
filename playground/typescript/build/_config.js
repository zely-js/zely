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
/* D:\zelx\playground\typescript\zely.config.ts */ "0": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e, r;
(Object.defineProperty(exports, "__esModule", {
  value: !0
}), Object.defineProperty(exports, "default", {
  enumerable: !0,
  get: function () {
    return u;
  }
}));
const t = __serpack_require__("@zely-js/core"), n = __serpack_require__("@zely-js/zely"), i = __serpack_require__("@zely-js/zely/middlewares");
function o(e, r, t, n, i, o, u) {
  try {
    var a = e[o](u), l = a.value;
  } catch (e) {
    t(e);
    return;
  }
  a.done ? r(l) : Promise.resolve(l).then(n, i);
}
((0, t.setSender))(((e = function* (e, r, n, i) {
  ((0, t.defaultSender))(e, r, n, i);
}, r = function () {
  var r = this, t = arguments;
  return new Promise(function (n, i) {
    var u = e.apply(r, t);
    function a(e) {
      o(u, n, i, a, l, "next", e);
    }
    function l(e) {
      o(u, n, i, a, l, "throw", e);
    }
    a(void 0);
  });
}, function (e, t, n, i) {
  return r.apply(this, arguments);
})));
const u = ((0, n.defineConfig))({
  server: {
    port: 3001
  },
  experimental: {
    useHTML: !0
  },
  allowAutoMiddlewares: !0,
  middlewares: [i.bodyMiddleware],
  __virtuals__: [((0, t.createVirtualPage))('main.ts', [((0, t.GET))(() => {})])]
});
 }),
/* D:\zelx\packages\zely-js\dist\middlewares.mjs */ "1": (function(__serpack_require__,__non_serpack_require__,module,exports) { (Object.defineProperty(exports, "__esModule", {
  value: !0
}), Object.defineProperty(exports, "bodyMiddleware", {
  enumerable: !0,
  get: function () {
    return t;
  }
}));
const e = __serpack_require__("node:module"), r = __serpack_require__("node:url");
(((0, r.fileURLToPath))(__serpack_require__("url").pathToFileURL(__filename).toString()), ((0, r.fileURLToPath))(new URL(".", __serpack_require__("url").pathToFileURL(__filename).toString())), ((0, e.createRequire))(__serpack_require__("url").pathToFileURL(__filename).toString()));
var t = (e, r) => {
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
 }),
});
Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});