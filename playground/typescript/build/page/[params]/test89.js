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
/* D:\zelx\playground\typescript\pages\[params]\test.ts */ "0": (function(__serpack_require__,__non_serpack_require__,module,exports) { var e;
(Object.defineProperty(exports, "__esModule", {
  value: !0
}), Object.defineProperty(exports, "default", {
  enumerable: !0,
  get: function () {
    return u;
  }
}));
const r = __serpack_require__("@zely-js/core"), t = __serpack_require__("timers/promises");
function n(e, r, t, n, o, u, i) {
  try {
    var s = e[u](i), a = s.value;
  } catch (e) {
    t(e);
    return;
  }
  s.done ? r(a) : Promise.resolve(a).then(n, o);
}
function o(e) {
  return function () {
    var r = this, t = arguments;
    return new Promise(function (o, u) {
      var i = e.apply(r, t);
      function s(e) {
        n(i, o, u, s, a, "next", e);
      }
      function a(e) {
        n(i, o, u, s, a, "throw", e);
      }
      s(void 0);
    });
  };
}
const u = [((0, r.ALL))(((e = o(function* (e) {
  let {data: r} = yield $store(o(function* () {
    return (yield ((0, t.setTimeout))(1000), `Hello ${e.params.params}!`);
  }), [e.params.params], "pages\[params]\test.ts-899");
  return r || 'null';
}), function (r) {
  return e.apply(this, arguments);
})))];
 }),
});
Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});