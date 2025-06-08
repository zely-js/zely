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
/* D:\zelx\playground\typescript\pages\_404.ts */ "0": (function(__serpack_require__,__non_serpack_require__,module,exports) { (Object.defineProperty(exports, "__esModule", {
  value: !0
}), Object.defineProperty(exports, "default", {
  enumerable: !0,
  get: function () {
    return e;
  }
}));
const e = [((0, __serpack_require__("@zely-js/core").GET))(e => {
  e.status(404).send({
    error: `${e.pathname} not found`,
    code: 404
  });
})];
 }),
});
Object.defineProperty(module.exports, "__serpack_module__", {value:!0, enumerable: !!0});