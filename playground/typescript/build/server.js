/*[params]\index.html*/ var p = (n, e, s = [], c = {}) => {
    e.children = [].concat(...s);
    for (let $ in e)
      if (
        Array.isArray(e[$]) &&
        e[$].length === 2 &&
        Array.isArray(e[$][0]) &&
        typeof e[$][1] == 'string'
      ) {
        let [i, o] = e[$];
        for (let l of i) o = o.replace(l, c[l]());
        e[$] = o;
      }
    let r = new n(e),
      t = r.$components();
    return r.$stylesheet(), r.$event(), t;
  },
  a = (n, e, s = [], c = {}) => {
    if (typeof n != 'string') return p(n, e, s, c);
    let r = document.createElement(n);
    for (let t in e)
      if (Array.isArray(e[t])) {
        let [$, i] = e[t];
        for (let o of $) i = i.replace(o, c[o]());
        r.setAttribute(t, i);
      } else r.setAttribute(t, e[t]);
    for (let t of s)
      Array.isArray(t) &&
        t.forEach(($) => {
          r.appendChild($);
        }),
        f(t) && r.appendChild(t);
    return r;
  },
  u = (n) => document.createTextNode(n),
  d = (n, e = !0, s = []) => {
    let c = ($) => (Array.isArray($) ? $ : [$]),
      r = n();
    if (Array.isArray(r)) return c(r);
    let t = document.createTextNode(r);
    return e && s.push([t, n]), c(t);
  };
function f(n) {
  return window.__env__ === 'ssr'
    ? n?.__component__
    : n instanceof Element || n instanceof HTMLDocument || n instanceof Text;
}
var _ = (n, e, s) => (n && (n = s), e && e(s), s);
window.$$ = { $cc: p, $ce: a, $ct: u, $cd: d, $isElement: f, $mount: _ };
var h = class {
  $subscribe = [];
  constructor(e) {
    var s = [],
      c = [],
      r = new Proxy(
        { __props__: {} },
        {
          set(t, $, i) {
            t[$] = i;
            for (let o of s) o[0].nodeValue = o[1]();
            return !0;
          },
        }
      );
    Object.keys(e).forEach((t) => (r[t] = e[t])),
      (this.$ = r),
      (this.$events = c),
      (this.$subscribe = s);
  }
  $kill() {
    this.$events.forEach((e) => e[1].removeEventListener(e[0], e[2]));
  }
  $components() {
    let { $: e, $events: s, $subscribe: c } = this;
    var r = { $0$: () => e.params.params, $1$: () => e.count };
    (this.$DEV_PROPS = r), (e.count = 0);
    function t() {
      e.count += 1;
    }
    return [
      a(
        'div',
        {},
        [
          a(
            'h1',
            {},
            [
              u('Hello, '),
              ...d(r.$0$, !0, this.$subscribe),
              u(': '),
              ...d(r.$1$, !0, this.$subscribe),
            ],
            this.$DEV_PROPS
          ),
          s.push(['click', a('button', {}, [u('Add')], this.$DEV_PROPS), t]) &&
            s[s.length - 1][1],
        ],
        this.$DEV_PROPS
      ),
    ];
  }
  $stylesheet() {
    var e = document.createElement('style');
    return (e.innerHTML = ''), e;
  }
  $event() {
    this.$events.forEach((e) => e[1].addEventListener(e[0], e[2]));
  }
  render(e) {
    document.head.appendChild(this.$stylesheet()),
      []
        .concat(...this.$components())
        .filter(f)
        .forEach((s) => e.appendChild(s)),
      this.$event();
  }
};
var y = JSON.parse(document.getElementById('__fe_props').innerText);
document.getElementById('__fe').innerHTML = '';
var m = new h(y);
m.render(document.getElementById('__fe'));
export { h as Component, h as default };
