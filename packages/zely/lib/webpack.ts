/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
// for using dynamic require
// reference: https://github.com/webpack/webpack/issues/4175
declare let __non_webpack_require__: any;
declare let __webpack_require__: any;

const loadModule =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

export default loadModule;
