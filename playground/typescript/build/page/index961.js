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
/* D:\zelx\playground\typescript\pages\index.ts */ "0": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e;
(Object.defineProperty(exports, "__esModule", {
  value: !0
}), Object.defineProperty(exports, "default", {
  enumerable: !0,
  get: function () {
    return u;
  }
}));
const t = __serpack_require__("@zely-js/core"), r = __serpack_require__("timers/promises");
function n(e, t, r, n, o, u, i) {
  try {
    var c = e[u](i), s = c.value;
  } catch (e) {
    r(e);
    return;
  }
  c.done ? t(s) : Promise.resolve(s).then(n, o);
}
function o(e) {
  return function () {
    var t = this, r = arguments;
    return new Promise(function (o, u) {
      var i = e.apply(t, r);
      function c(e) {
        n(i, o, u, c, s, "next", e);
      }
      function s(e) {
        n(i, o, u, c, s, "throw", e);
      }
      c(void 0);
    });
  };
}
const u = [((0, t.ALL))(((e = o(function* (e) {
  let {data: t} = yield $store(o(function* () {
    return (yield ((0, r.setTimeout))(1000), 'Hello!');
  }), [], "pages\index.ts-899");
  return t;
}), function (t) {
  return e.apply(this, arguments);
})))];
 }),
});
Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});