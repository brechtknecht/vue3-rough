import { ref as tt, onMounted as mt, provide as ht, watch as bt, openBlock as Lt, createElementBlock as Tt, renderSlot as Dt, createCommentVNode as Ct, inject as yt, onUnmounted as At, watchEffect as It } from "vue";
function X(a, t, s) {
  if (a && a.length) {
    const [e, n] = t, o = Math.PI / 180 * s, h = Math.cos(o), r = Math.sin(o);
    a.forEach((l) => {
      const [f, i] = l;
      l[0] = (f - e) * h - (i - n) * r + e, l[1] = (f - e) * r + (i - n) * h + n;
    });
  }
}
function K(a) {
  const t = a[0], s = a[1];
  return Math.sqrt(Math.pow(t[0] - s[0], 2) + Math.pow(t[1] - s[1], 2));
}
function G(a, t) {
  const s = t.hachureAngle + 90;
  let e = t.hachureGap;
  e < 0 && (e = 4 * t.strokeWidth), e = Math.max(e, 0.1);
  const n = [0, 0];
  if (s)
    for (const h of a)
      X(h, n, s);
  const o = function(h, r) {
    const l = [];
    for (const u of h) {
      const c = [...u];
      c[0].join(",") !== c[c.length - 1].join(",") && c.push([c[0][0], c[0][1]]), c.length > 2 && l.push(c);
    }
    const f = [];
    r = Math.max(r, 0.1);
    const i = [];
    for (const u of l)
      for (let c = 0; c < u.length - 1; c++) {
        const M = u[c], g = u[c + 1];
        if (M[1] !== g[1]) {
          const k = Math.min(M[1], g[1]);
          i.push({ ymin: k, ymax: Math.max(M[1], g[1]), x: k === M[1] ? M[0] : g[0], islope: (g[0] - M[0]) / (g[1] - M[1]) });
        }
      }
    if (i.sort((u, c) => u.ymin < c.ymin ? -1 : u.ymin > c.ymin ? 1 : u.x < c.x ? -1 : u.x > c.x ? 1 : u.ymax === c.ymax ? 0 : (u.ymax - c.ymax) / Math.abs(u.ymax - c.ymax)), !i.length)
      return f;
    let d = [], p = i[0].ymin;
    for (; d.length || i.length; ) {
      if (i.length) {
        let u = -1;
        for (let c = 0; c < i.length && !(i[c].ymin > p); c++)
          u = c;
        i.splice(0, u + 1).forEach((c) => {
          d.push({ s: p, edge: c });
        });
      }
      if (d = d.filter((u) => !(u.edge.ymax <= p)), d.sort((u, c) => u.edge.x === c.edge.x ? 0 : (u.edge.x - c.edge.x) / Math.abs(u.edge.x - c.edge.x)), d.length > 1)
        for (let u = 0; u < d.length; u += 2) {
          const c = u + 1;
          if (c >= d.length)
            break;
          const M = d[u].edge, g = d[c].edge;
          f.push([[Math.round(M.x), p], [Math.round(g.x), p]]);
        }
      p += r, d.forEach((u) => {
        u.edge.x = u.edge.x + r * u.edge.islope;
      });
    }
    return f;
  }(a, e);
  if (s) {
    for (const h of a)
      X(h, n, -s);
    (function(h, r, l) {
      const f = [];
      h.forEach((i) => f.push(...i)), X(f, r, l);
    })(o, n, -s);
  }
  return o;
}
class at {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, s) {
    return this._fillPolygons(t, s);
  }
  _fillPolygons(t, s) {
    const e = G(t, s);
    return { type: "fillSketch", ops: this.renderLines(e, s) };
  }
  renderLines(t, s) {
    const e = [];
    for (const n of t)
      e.push(...this.helper.doubleLineOps(n[0][0], n[0][1], n[1][0], n[1][1], s));
    return e;
  }
}
class Et extends at {
  fillPolygons(t, s) {
    let e = s.hachureGap;
    e < 0 && (e = 4 * s.strokeWidth), e = Math.max(e, 0.1);
    const n = G(t, Object.assign({}, s, { hachureGap: e })), o = Math.PI / 180 * s.hachureAngle, h = [], r = 0.5 * e * Math.cos(o), l = 0.5 * e * Math.sin(o);
    for (const [f, i] of n)
      K([f, i]) && h.push([[f[0] - r, f[1] + l], [...i]], [[f[0] + r, f[1] - l], [...i]]);
    return { type: "fillSketch", ops: this.renderLines(h, s) };
  }
}
class $t extends at {
  fillPolygons(t, s) {
    const e = this._fillPolygons(t, s), n = Object.assign({}, s, { hachureAngle: s.hachureAngle + 90 }), o = this._fillPolygons(t, n);
    return e.ops = e.ops.concat(o.ops), e;
  }
}
class zt {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, s) {
    const e = G(t, s = Object.assign({}, s, { hachureAngle: 0 }));
    return this.dotsOnLines(e, s);
  }
  dotsOnLines(t, s) {
    const e = [];
    let n = s.hachureGap;
    n < 0 && (n = 4 * s.strokeWidth), n = Math.max(n, 0.1);
    let o = s.fillWeight;
    o < 0 && (o = s.strokeWidth / 2);
    const h = n / 4;
    for (const r of t) {
      const l = K(r), f = l / n, i = Math.ceil(f) - 1, d = l - i * n, p = (r[0][0] + r[1][0]) / 2 - n / 4, u = Math.min(r[0][1], r[1][1]);
      for (let c = 0; c < i; c++) {
        const M = u + d + c * n, g = p - h + 2 * Math.random() * h, k = M - h + 2 * Math.random() * h, b = this.helper.ellipse(g, k, o, o, s);
        e.push(...b.ops);
      }
    }
    return { type: "fillSketch", ops: e };
  }
}
class Wt {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, s) {
    const e = G(t, s);
    return { type: "fillSketch", ops: this.dashedLine(e, s) };
  }
  dashedLine(t, s) {
    const e = s.dashOffset < 0 ? s.hachureGap < 0 ? 4 * s.strokeWidth : s.hachureGap : s.dashOffset, n = s.dashGap < 0 ? s.hachureGap < 0 ? 4 * s.strokeWidth : s.hachureGap : s.dashGap, o = [];
    return t.forEach((h) => {
      const r = K(h), l = Math.floor(r / (e + n)), f = (r + n - l * (e + n)) / 2;
      let i = h[0], d = h[1];
      i[0] > d[0] && (i = h[1], d = h[0]);
      const p = Math.atan((d[1] - i[1]) / (d[0] - i[0]));
      for (let u = 0; u < l; u++) {
        const c = u * (e + n), M = c + e, g = [i[0] + c * Math.cos(p) + f * Math.cos(p), i[1] + c * Math.sin(p) + f * Math.sin(p)], k = [i[0] + M * Math.cos(p) + f * Math.cos(p), i[1] + M * Math.sin(p) + f * Math.sin(p)];
        o.push(...this.helper.doubleLineOps(g[0], g[1], k[0], k[1], s));
      }
    }), o;
  }
}
class Rt {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, s) {
    const e = s.hachureGap < 0 ? 4 * s.strokeWidth : s.hachureGap, n = s.zigzagOffset < 0 ? e : s.zigzagOffset, o = G(t, s = Object.assign({}, s, { hachureGap: e + n }));
    return { type: "fillSketch", ops: this.zigzagLines(o, n, s) };
  }
  zigzagLines(t, s, e) {
    const n = [];
    return t.forEach((o) => {
      const h = K(o), r = Math.round(h / (2 * s));
      let l = o[0], f = o[1];
      l[0] > f[0] && (l = o[1], f = o[0]);
      const i = Math.atan((f[1] - l[1]) / (f[0] - l[0]));
      for (let d = 0; d < r; d++) {
        const p = 2 * d * s, u = 2 * (d + 1) * s, c = Math.sqrt(2 * Math.pow(s, 2)), M = [l[0] + p * Math.cos(i), l[1] + p * Math.sin(i)], g = [l[0] + u * Math.cos(i), l[1] + u * Math.sin(i)], k = [M[0] + c * Math.cos(i + Math.PI / 4), M[1] + c * Math.sin(i + Math.PI / 4)];
        n.push(...this.helper.doubleLineOps(M[0], M[1], k[0], k[1], e), ...this.helper.doubleLineOps(k[0], k[1], g[0], g[1], e));
      }
    }), n;
  }
}
const w = {};
class jt {
  constructor(t) {
    this.seed = t;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
const F = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function Y(a, t) {
  return a.type === t;
}
function et(a) {
  const t = [], s = function(h) {
    const r = new Array();
    for (; h !== ""; )
      if (h.match(/^([ \t\r\n,]+)/))
        h = h.substr(RegExp.$1.length);
      else if (h.match(/^([aAcChHlLmMqQsStTvVzZ])/))
        r[r.length] = { type: 0, text: RegExp.$1 }, h = h.substr(RegExp.$1.length);
      else {
        if (!h.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/))
          return [];
        r[r.length] = { type: 1, text: `${parseFloat(RegExp.$1)}` }, h = h.substr(RegExp.$1.length);
      }
    return r[r.length] = { type: 2, text: "" }, r;
  }(a);
  let e = "BOD", n = 0, o = s[n];
  for (; !Y(o, 2); ) {
    let h = 0;
    const r = [];
    if (e === "BOD") {
      if (o.text !== "M" && o.text !== "m")
        return et("M0,0" + a);
      n++, h = F[o.text], e = o.text;
    } else
      Y(o, 1) ? h = F[e] : (n++, h = F[o.text], e = o.text);
    if (!(n + h < s.length))
      throw new Error("Path data ended short");
    for (let l = n; l < n + h; l++) {
      const f = s[l];
      if (!Y(f, 1))
        throw new Error("Param not a number: " + e + "," + f.text);
      r[r.length] = +f.text;
    }
    if (typeof F[e] != "number")
      throw new Error("Bad segment: " + e);
    {
      const l = { key: e, data: r };
      t.push(l), n += h, o = s[n], e === "M" && (e = "L"), e === "m" && (e = "l");
    }
  }
  return t;
}
function it(a) {
  let t = 0, s = 0, e = 0, n = 0;
  const o = [];
  for (const { key: h, data: r } of a)
    switch (h) {
      case "M":
        o.push({ key: "M", data: [...r] }), [t, s] = r, [e, n] = r;
        break;
      case "m":
        t += r[0], s += r[1], o.push({ key: "M", data: [t, s] }), e = t, n = s;
        break;
      case "L":
        o.push({ key: "L", data: [...r] }), [t, s] = r;
        break;
      case "l":
        t += r[0], s += r[1], o.push({ key: "L", data: [t, s] });
        break;
      case "C":
        o.push({ key: "C", data: [...r] }), t = r[4], s = r[5];
        break;
      case "c": {
        const l = r.map((f, i) => i % 2 ? f + s : f + t);
        o.push({ key: "C", data: l }), t = l[4], s = l[5];
        break;
      }
      case "Q":
        o.push({ key: "Q", data: [...r] }), t = r[2], s = r[3];
        break;
      case "q": {
        const l = r.map((f, i) => i % 2 ? f + s : f + t);
        o.push({ key: "Q", data: l }), t = l[2], s = l[3];
        break;
      }
      case "A":
        o.push({ key: "A", data: [...r] }), t = r[5], s = r[6];
        break;
      case "a":
        t += r[5], s += r[6], o.push({ key: "A", data: [r[0], r[1], r[2], r[3], r[4], t, s] });
        break;
      case "H":
        o.push({ key: "H", data: [...r] }), t = r[0];
        break;
      case "h":
        t += r[0], o.push({ key: "H", data: [t] });
        break;
      case "V":
        o.push({ key: "V", data: [...r] }), s = r[0];
        break;
      case "v":
        s += r[0], o.push({ key: "V", data: [s] });
        break;
      case "S":
        o.push({ key: "S", data: [...r] }), t = r[2], s = r[3];
        break;
      case "s": {
        const l = r.map((f, i) => i % 2 ? f + s : f + t);
        o.push({ key: "S", data: l }), t = l[2], s = l[3];
        break;
      }
      case "T":
        o.push({ key: "T", data: [...r] }), t = r[0], s = r[1];
        break;
      case "t":
        t += r[0], s += r[1], o.push({ key: "T", data: [t, s] });
        break;
      case "Z":
      case "z":
        o.push({ key: "Z", data: [] }), t = e, s = n;
    }
  return o;
}
function ct(a) {
  const t = [];
  let s = "", e = 0, n = 0, o = 0, h = 0, r = 0, l = 0;
  for (const { key: f, data: i } of a) {
    switch (f) {
      case "M":
        t.push({ key: "M", data: [...i] }), [e, n] = i, [o, h] = i;
        break;
      case "C":
        t.push({ key: "C", data: [...i] }), e = i[4], n = i[5], r = i[2], l = i[3];
        break;
      case "L":
        t.push({ key: "L", data: [...i] }), [e, n] = i;
        break;
      case "H":
        e = i[0], t.push({ key: "L", data: [e, n] });
        break;
      case "V":
        n = i[0], t.push({ key: "L", data: [e, n] });
        break;
      case "S": {
        let d = 0, p = 0;
        s === "C" || s === "S" ? (d = e + (e - r), p = n + (n - l)) : (d = e, p = n), t.push({ key: "C", data: [d, p, ...i] }), r = i[0], l = i[1], e = i[2], n = i[3];
        break;
      }
      case "T": {
        const [d, p] = i;
        let u = 0, c = 0;
        s === "Q" || s === "T" ? (u = e + (e - r), c = n + (n - l)) : (u = e, c = n);
        const M = e + 2 * (u - e) / 3, g = n + 2 * (c - n) / 3, k = d + 2 * (u - d) / 3, b = p + 2 * (c - p) / 3;
        t.push({ key: "C", data: [M, g, k, b, d, p] }), r = u, l = c, e = d, n = p;
        break;
      }
      case "Q": {
        const [d, p, u, c] = i, M = e + 2 * (d - e) / 3, g = n + 2 * (p - n) / 3, k = u + 2 * (d - u) / 3, b = c + 2 * (p - c) / 3;
        t.push({ key: "C", data: [M, g, k, b, u, c] }), r = d, l = p, e = u, n = c;
        break;
      }
      case "A": {
        const d = Math.abs(i[0]), p = Math.abs(i[1]), u = i[2], c = i[3], M = i[4], g = i[5], k = i[6];
        d === 0 || p === 0 ? (t.push({ key: "C", data: [e, n, g, k, g, k] }), e = g, n = k) : (e !== g || n !== k) && (vt(e, n, g, k, d, p, u, c, M).forEach(function(b) {
          t.push({ key: "C", data: b });
        }), e = g, n = k);
        break;
      }
      case "Z":
        t.push({ key: "Z", data: [] }), e = o, n = h;
    }
    s = f;
  }
  return t;
}
function R(a, t, s) {
  return [a * Math.cos(s) - t * Math.sin(s), a * Math.sin(s) + t * Math.cos(s)];
}
function vt(a, t, s, e, n, o, h, r, l, f) {
  const i = (d = h, Math.PI * d / 180);
  var d;
  let p = [], u = 0, c = 0, M = 0, g = 0;
  if (f)
    [u, c, M, g] = f;
  else {
    [a, t] = R(a, t, -i), [s, e] = R(s, e, -i);
    const S = (a - s) / 2, v = (t - e) / 2;
    let D = S * S / (n * n) + v * v / (o * o);
    D > 1 && (D = Math.sqrt(D), n *= D, o *= D);
    const $ = n * n, z = o * o, St = $ * z - $ * v * v - z * S * S, _t = $ * v * v + z * S * S, rt = (r === l ? -1 : 1) * Math.sqrt(Math.abs(St / _t));
    M = rt * n * v / o + (a + s) / 2, g = rt * -o * S / n + (t + e) / 2, u = Math.asin(parseFloat(((t - g) / o).toFixed(9))), c = Math.asin(parseFloat(((e - g) / o).toFixed(9))), a < M && (u = Math.PI - u), s < M && (c = Math.PI - c), u < 0 && (u = 2 * Math.PI + u), c < 0 && (c = 2 * Math.PI + c), l && u > c && (u -= 2 * Math.PI), !l && c > u && (c -= 2 * Math.PI);
  }
  let k = c - u;
  if (Math.abs(k) > 120 * Math.PI / 180) {
    const S = c, v = s, D = e;
    c = l && c > u ? u + 120 * Math.PI / 180 * 1 : u + 120 * Math.PI / 180 * -1, p = vt(s = M + n * Math.cos(c), e = g + o * Math.sin(c), v, D, n, o, h, 0, l, [c, S, M, g]);
  }
  k = c - u;
  const b = Math.cos(u), O = Math.sin(u), _ = Math.cos(c), y = Math.sin(c), x = Math.tan(k / 4), C = 4 / 3 * n * x, T = 4 / 3 * o * x, q = [a, t], L = [a + C * O, t - T * b], I = [s + C * y, e - T * _], ot = [s, e];
  if (L[0] = 2 * q[0] - L[0], L[1] = 2 * q[1] - L[1], f)
    return [L, I, ot].concat(p);
  {
    p = [L, I, ot].concat(p);
    const S = [];
    for (let v = 0; v < p.length; v += 3) {
      const D = R(p[v][0], p[v][1], i), $ = R(p[v + 1][0], p[v + 1][1], i), z = R(p[v + 2][0], p[v + 2][1], i);
      S.push([D[0], D[1], $[0], $[1], z[0], z[1]]);
    }
    return S;
  }
}
const Gt = { randOffset: function(a, t) {
  return m(a, t);
}, randOffsetWithRange: function(a, t, s) {
  return H(a, t, s);
}, ellipse: function(a, t, s, e, n) {
  const o = xt(s, e, n);
  return st(a, t, n, o).opset;
}, doubleLineOps: function(a, t, s, e, n) {
  return A(a, t, s, e, n, !0);
} };
function wt(a, t, s, e, n) {
  return { type: "path", ops: A(a, t, s, e, n) };
}
function Z(a, t, s) {
  const e = (a || []).length;
  if (e > 2) {
    const n = [];
    for (let o = 0; o < e - 1; o++)
      n.push(...A(a[o][0], a[o][1], a[o + 1][0], a[o + 1][1], s));
    return t && n.push(...A(a[e - 1][0], a[e - 1][1], a[0][0], a[0][1], s)), { type: "path", ops: n };
  }
  return e === 2 ? wt(a[0][0], a[0][1], a[1][0], a[1][1], s) : { type: "path", ops: [] };
}
function qt(a, t, s, e, n) {
  return function(o, h) {
    return Z(o, !0, h);
  }([[a, t], [a + s, t], [a + s, t + e], [a, t + e]], n);
}
function Ft(a, t) {
  let s = ft(a, 1 * (1 + 0.2 * t.roughness), t);
  if (!t.disableMultiStroke) {
    const e = ft(a, 1.5 * (1 + 0.22 * t.roughness), function(n) {
      const o = Object.assign({}, n);
      return o.randomizer = void 0, n.seed && (o.seed = n.seed + 1), o;
    }(t));
    s = s.concat(e);
  }
  return { type: "path", ops: s };
}
function xt(a, t, s) {
  const e = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(a / 2, 2) + Math.pow(t / 2, 2)) / 2)), n = Math.ceil(Math.max(s.curveStepCount, s.curveStepCount / Math.sqrt(200) * e)), o = 2 * Math.PI / n;
  let h = Math.abs(a / 2), r = Math.abs(t / 2);
  const l = 1 - s.curveFitting;
  return h += m(h * l, s), r += m(r * l, s), { increment: o, rx: h, ry: r };
}
function st(a, t, s, e) {
  const [n, o] = pt(e.increment, a, t, e.rx, e.ry, 1, e.increment * H(0.1, H(0.4, 1, s), s), s);
  let h = B(n, null, s);
  if (!s.disableMultiStroke && s.roughness !== 0) {
    const [r] = pt(e.increment, a, t, e.rx, e.ry, 1.5, 0, s), l = B(r, null, s);
    h = h.concat(l);
  }
  return { estimatedPoints: o, opset: { type: "path", ops: h } };
}
function lt(a, t, s, e, n, o, h, r, l) {
  const f = a, i = t;
  let d = Math.abs(s / 2), p = Math.abs(e / 2);
  d += m(0.01 * d, l), p += m(0.01 * p, l);
  let u = n, c = o;
  for (; u < 0; )
    u += 2 * Math.PI, c += 2 * Math.PI;
  c - u > 2 * Math.PI && (u = 0, c = 2 * Math.PI);
  const M = 2 * Math.PI / l.curveStepCount, g = Math.min(M / 2, (c - u) / 2), k = dt(g, f, i, d, p, u, c, 1, l);
  if (!l.disableMultiStroke) {
    const b = dt(g, f, i, d, p, u, c, 1.5, l);
    k.push(...b);
  }
  return h && (r ? k.push(...A(f, i, f + d * Math.cos(u), i + p * Math.sin(u), l), ...A(f, i, f + d * Math.cos(c), i + p * Math.sin(c), l)) : k.push({ op: "lineTo", data: [f, i] }, { op: "lineTo", data: [f + d * Math.cos(u), i + p * Math.sin(u)] })), { type: "path", ops: k };
}
function V(a, t) {
  const s = [];
  for (const e of a)
    if (e.length) {
      const n = t.maxRandomnessOffset || 0, o = e.length;
      if (o > 2) {
        s.push({ op: "move", data: [e[0][0] + m(n, t), e[0][1] + m(n, t)] });
        for (let h = 1; h < o; h++)
          s.push({ op: "lineTo", data: [e[h][0] + m(n, t), e[h][1] + m(n, t)] });
      }
    }
  return { type: "fillPath", ops: s };
}
function W(a, t) {
  return function(s, e) {
    let n = s.fillStyle || "hachure";
    if (!w[n])
      switch (n) {
        case "zigzag":
          w[n] || (w[n] = new Et(e));
          break;
        case "cross-hatch":
          w[n] || (w[n] = new $t(e));
          break;
        case "dots":
          w[n] || (w[n] = new zt(e));
          break;
        case "dashed":
          w[n] || (w[n] = new Wt(e));
          break;
        case "zigzag-line":
          w[n] || (w[n] = new Rt(e));
          break;
        case "hachure":
        default:
          n = "hachure", w[n] || (w[n] = new at(e));
      }
    return w[n];
  }(t, Gt).fillPolygons(a, t);
}
function Pt(a) {
  return a.randomizer || (a.randomizer = new jt(a.seed || 0)), a.randomizer.next();
}
function H(a, t, s, e = 1) {
  return s.roughness * e * (Pt(s) * (t - a) + a);
}
function m(a, t, s = 1) {
  return H(-a, a, t, s);
}
function A(a, t, s, e, n, o = !1) {
  const h = o ? n.disableMultiStrokeFill : n.disableMultiStroke, r = ut(a, t, s, e, n, !0, !1);
  if (h)
    return r;
  const l = ut(a, t, s, e, n, !0, !0);
  return r.concat(l);
}
function ut(a, t, s, e, n, o, h) {
  const r = Math.pow(a - s, 2) + Math.pow(t - e, 2), l = Math.sqrt(r);
  let f = 1;
  f = l < 200 ? 1 : l > 500 ? 0.4 : -16668e-7 * l + 1.233334;
  let i = n.maxRandomnessOffset || 0;
  i * i * 100 > r && (i = l / 10);
  const d = i / 2, p = 0.2 + 0.2 * Pt(n);
  let u = n.bowing * n.maxRandomnessOffset * (e - t) / 200, c = n.bowing * n.maxRandomnessOffset * (a - s) / 200;
  u = m(u, n, f), c = m(c, n, f);
  const M = [], g = () => m(d, n, f), k = () => m(i, n, f), b = n.preserveVertices;
  return o && (h ? M.push({ op: "move", data: [a + (b ? 0 : g()), t + (b ? 0 : g())] }) : M.push({ op: "move", data: [a + (b ? 0 : m(i, n, f)), t + (b ? 0 : m(i, n, f))] })), h ? M.push({ op: "bcurveTo", data: [u + a + (s - a) * p + g(), c + t + (e - t) * p + g(), u + a + 2 * (s - a) * p + g(), c + t + 2 * (e - t) * p + g(), s + (b ? 0 : g()), e + (b ? 0 : g())] }) : M.push({ op: "bcurveTo", data: [u + a + (s - a) * p + k(), c + t + (e - t) * p + k(), u + a + 2 * (s - a) * p + k(), c + t + 2 * (e - t) * p + k(), s + (b ? 0 : k()), e + (b ? 0 : k())] }), M;
}
function ft(a, t, s) {
  const e = [];
  e.push([a[0][0] + m(t, s), a[0][1] + m(t, s)]), e.push([a[0][0] + m(t, s), a[0][1] + m(t, s)]);
  for (let n = 1; n < a.length; n++)
    e.push([a[n][0] + m(t, s), a[n][1] + m(t, s)]), n === a.length - 1 && e.push([a[n][0] + m(t, s), a[n][1] + m(t, s)]);
  return B(e, null, s);
}
function B(a, t, s) {
  const e = a.length, n = [];
  if (e > 3) {
    const o = [], h = 1 - s.curveTightness;
    n.push({ op: "move", data: [a[1][0], a[1][1]] });
    for (let r = 1; r + 2 < e; r++) {
      const l = a[r];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (h * a[r + 1][0] - h * a[r - 1][0]) / 6, l[1] + (h * a[r + 1][1] - h * a[r - 1][1]) / 6], o[2] = [a[r + 1][0] + (h * a[r][0] - h * a[r + 2][0]) / 6, a[r + 1][1] + (h * a[r][1] - h * a[r + 2][1]) / 6], o[3] = [a[r + 1][0], a[r + 1][1]], n.push({ op: "bcurveTo", data: [o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]] });
    }
    if (t && t.length === 2) {
      const r = s.maxRandomnessOffset;
      n.push({ op: "lineTo", data: [t[0] + m(r, s), t[1] + m(r, s)] });
    }
  } else
    e === 3 ? (n.push({ op: "move", data: [a[1][0], a[1][1]] }), n.push({ op: "bcurveTo", data: [a[1][0], a[1][1], a[2][0], a[2][1], a[2][0], a[2][1]] })) : e === 2 && n.push(...A(a[0][0], a[0][1], a[1][0], a[1][1], s));
  return n;
}
function pt(a, t, s, e, n, o, h, r) {
  const l = [], f = [];
  if (r.roughness === 0) {
    a /= 4, f.push([t + e * Math.cos(-a), s + n * Math.sin(-a)]);
    for (let i = 0; i <= 2 * Math.PI; i += a) {
      const d = [t + e * Math.cos(i), s + n * Math.sin(i)];
      l.push(d), f.push(d);
    }
    f.push([t + e * Math.cos(0), s + n * Math.sin(0)]), f.push([t + e * Math.cos(a), s + n * Math.sin(a)]);
  } else {
    const i = m(0.5, r) - Math.PI / 2;
    f.push([m(o, r) + t + 0.9 * e * Math.cos(i - a), m(o, r) + s + 0.9 * n * Math.sin(i - a)]);
    const d = 2 * Math.PI + i - 0.01;
    for (let p = i; p < d; p += a) {
      const u = [m(o, r) + t + e * Math.cos(p), m(o, r) + s + n * Math.sin(p)];
      l.push(u), f.push(u);
    }
    f.push([m(o, r) + t + e * Math.cos(i + 2 * Math.PI + 0.5 * h), m(o, r) + s + n * Math.sin(i + 2 * Math.PI + 0.5 * h)]), f.push([m(o, r) + t + 0.98 * e * Math.cos(i + h), m(o, r) + s + 0.98 * n * Math.sin(i + h)]), f.push([m(o, r) + t + 0.9 * e * Math.cos(i + 0.5 * h), m(o, r) + s + 0.9 * n * Math.sin(i + 0.5 * h)]);
  }
  return [f, l];
}
function dt(a, t, s, e, n, o, h, r, l) {
  const f = o + m(0.1, l), i = [];
  i.push([m(r, l) + t + 0.9 * e * Math.cos(f - a), m(r, l) + s + 0.9 * n * Math.sin(f - a)]);
  for (let d = f; d <= h; d += a)
    i.push([m(r, l) + t + e * Math.cos(d), m(r, l) + s + n * Math.sin(d)]);
  return i.push([t + e * Math.cos(h), s + n * Math.sin(h)]), i.push([t + e * Math.cos(h), s + n * Math.sin(h)]), B(i, null, l);
}
function Vt(a, t, s, e, n, o, h, r) {
  const l = [], f = [r.maxRandomnessOffset || 1, (r.maxRandomnessOffset || 1) + 0.3];
  let i = [0, 0];
  const d = r.disableMultiStroke ? 1 : 2, p = r.preserveVertices;
  for (let u = 0; u < d; u++)
    u === 0 ? l.push({ op: "move", data: [h[0], h[1]] }) : l.push({ op: "move", data: [h[0] + (p ? 0 : m(f[0], r)), h[1] + (p ? 0 : m(f[0], r))] }), i = p ? [n, o] : [n + m(f[u], r), o + m(f[u], r)], l.push({ op: "bcurveTo", data: [a + m(f[u], r), t + m(f[u], r), s + m(f[u], r), e + m(f[u], r), i[0], i[1]] });
  return l;
}
function j(a) {
  return [...a];
}
function Q(a, t) {
  return Math.pow(a[0] - t[0], 2) + Math.pow(a[1] - t[1], 2);
}
function Nt(a, t, s) {
  const e = Q(t, s);
  if (e === 0)
    return Q(a, t);
  let n = ((a[0] - t[0]) * (s[0] - t[0]) + (a[1] - t[1]) * (s[1] - t[1])) / e;
  return n = Math.max(0, Math.min(1, n)), Q(a, E(t, s, n));
}
function E(a, t, s) {
  return [a[0] + (t[0] - a[0]) * s, a[1] + (t[1] - a[1]) * s];
}
function nt(a, t, s, e) {
  const n = e || [];
  if (function(r, l) {
    const f = r[l + 0], i = r[l + 1], d = r[l + 2], p = r[l + 3];
    let u = 3 * i[0] - 2 * f[0] - p[0];
    u *= u;
    let c = 3 * i[1] - 2 * f[1] - p[1];
    c *= c;
    let M = 3 * d[0] - 2 * p[0] - f[0];
    M *= M;
    let g = 3 * d[1] - 2 * p[1] - f[1];
    return g *= g, u < M && (u = M), c < g && (c = g), u + c;
  }(a, t) < s) {
    const r = a[t + 0];
    n.length ? (o = n[n.length - 1], h = r, Math.sqrt(Q(o, h)) > 1 && n.push(r)) : n.push(r), n.push(a[t + 3]);
  } else {
    const l = a[t + 0], f = a[t + 1], i = a[t + 2], d = a[t + 3], p = E(l, f, 0.5), u = E(f, i, 0.5), c = E(i, d, 0.5), M = E(p, u, 0.5), g = E(u, c, 0.5), k = E(M, g, 0.5);
    nt([l, p, M, k], 0, s, n), nt([k, g, c, d], 0, s, n);
  }
  var o, h;
  return n;
}
function Zt(a, t) {
  return U(a, 0, a.length, t);
}
function U(a, t, s, e, n) {
  const o = n || [], h = a[t], r = a[s - 1];
  let l = 0, f = 1;
  for (let i = t + 1; i < s - 1; ++i) {
    const d = Nt(a[i], h, r);
    d > l && (l = d, f = i);
  }
  return Math.sqrt(l) > e ? (U(a, t, f + 1, e, o), U(a, f, s, e, o)) : (o.length || o.push(h), o.push(r)), o;
}
function gt(a, t = 0.15, s) {
  const e = [], n = (a.length - 1) / 3;
  for (let o = 0; o < n; o++)
    nt(a, 3 * o, t, e);
  return s && s > 0 ? U(e, 0, e.length, s) : e;
}
const P = "none";
class J {
  constructor(t) {
    this.defaultOptions = { maxRandomnessOffset: 2, roughness: 1, bowing: 1, stroke: "#000", strokeWidth: 1, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, seed: 0, disableMultiStroke: !1, disableMultiStrokeFill: !1, preserveVertices: !1 }, this.config = t || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
  }
  static newSeed() {
    return Math.floor(Math.random() * 2 ** 31);
  }
  _o(t) {
    return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions;
  }
  _d(t, s, e) {
    return { shape: t, sets: s || [], options: e || this.defaultOptions };
  }
  line(t, s, e, n, o) {
    const h = this._o(o);
    return this._d("line", [wt(t, s, e, n, h)], h);
  }
  rectangle(t, s, e, n, o) {
    const h = this._o(o), r = [], l = qt(t, s, e, n, h);
    if (h.fill) {
      const f = [[t, s], [t + e, s], [t + e, s + n], [t, s + n]];
      h.fillStyle === "solid" ? r.push(V([f], h)) : r.push(W([f], h));
    }
    return h.stroke !== P && r.push(l), this._d("rectangle", r, h);
  }
  ellipse(t, s, e, n, o) {
    const h = this._o(o), r = [], l = xt(e, n, h), f = st(t, s, h, l);
    if (h.fill)
      if (h.fillStyle === "solid") {
        const i = st(t, s, h, l).opset;
        i.type = "fillPath", r.push(i);
      } else
        r.push(W([f.estimatedPoints], h));
    return h.stroke !== P && r.push(f.opset), this._d("ellipse", r, h);
  }
  circle(t, s, e, n) {
    const o = this.ellipse(t, s, e, e, n);
    return o.shape = "circle", o;
  }
  linearPath(t, s) {
    const e = this._o(s);
    return this._d("linearPath", [Z(t, !1, e)], e);
  }
  arc(t, s, e, n, o, h, r = !1, l) {
    const f = this._o(l), i = [], d = lt(t, s, e, n, o, h, r, !0, f);
    if (r && f.fill)
      if (f.fillStyle === "solid") {
        const p = Object.assign({}, f);
        p.disableMultiStroke = !0;
        const u = lt(t, s, e, n, o, h, !0, !1, p);
        u.type = "fillPath", i.push(u);
      } else
        i.push(function(p, u, c, M, g, k, b) {
          const O = p, _ = u;
          let y = Math.abs(c / 2), x = Math.abs(M / 2);
          y += m(0.01 * y, b), x += m(0.01 * x, b);
          let C = g, T = k;
          for (; C < 0; )
            C += 2 * Math.PI, T += 2 * Math.PI;
          T - C > 2 * Math.PI && (C = 0, T = 2 * Math.PI);
          const q = (T - C) / b.curveStepCount, L = [];
          for (let I = C; I <= T; I += q)
            L.push([O + y * Math.cos(I), _ + x * Math.sin(I)]);
          return L.push([O + y * Math.cos(T), _ + x * Math.sin(T)]), L.push([O, _]), W([L], b);
        }(t, s, e, n, o, h, f));
    return f.stroke !== P && i.push(d), this._d("arc", i, f);
  }
  curve(t, s) {
    const e = this._o(s), n = [], o = Ft(t, e);
    if (e.fill && e.fill !== P && t.length >= 3) {
      const h = gt(function(r, l = 0) {
        const f = r.length;
        if (f < 3)
          throw new Error("A curve must have at least three points.");
        const i = [];
        if (f === 3)
          i.push(j(r[0]), j(r[1]), j(r[2]), j(r[2]));
        else {
          const d = [];
          d.push(r[0], r[0]);
          for (let c = 1; c < r.length; c++)
            d.push(r[c]), c === r.length - 1 && d.push(r[c]);
          const p = [], u = 1 - l;
          i.push(j(d[0]));
          for (let c = 1; c + 2 < d.length; c++) {
            const M = d[c];
            p[0] = [M[0], M[1]], p[1] = [M[0] + (u * d[c + 1][0] - u * d[c - 1][0]) / 6, M[1] + (u * d[c + 1][1] - u * d[c - 1][1]) / 6], p[2] = [d[c + 1][0] + (u * d[c][0] - u * d[c + 2][0]) / 6, d[c + 1][1] + (u * d[c][1] - u * d[c + 2][1]) / 6], p[3] = [d[c + 1][0], d[c + 1][1]], i.push(p[1], p[2], p[3]);
          }
        }
        return i;
      }(t), 10, (1 + e.roughness) / 2);
      e.fillStyle === "solid" ? n.push(V([h], e)) : n.push(W([h], e));
    }
    return e.stroke !== P && n.push(o), this._d("curve", n, e);
  }
  polygon(t, s) {
    const e = this._o(s), n = [], o = Z(t, !0, e);
    return e.fill && (e.fillStyle === "solid" ? n.push(V([t], e)) : n.push(W([t], e))), e.stroke !== P && n.push(o), this._d("polygon", n, e);
  }
  path(t, s) {
    const e = this._o(s), n = [];
    if (!t)
      return this._d("path", n, e);
    t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const o = e.fill && e.fill !== "transparent" && e.fill !== P, h = e.stroke !== P, r = !!(e.simplification && e.simplification < 1), l = function(f, i, d) {
      const p = ct(it(et(f))), u = [];
      let c = [], M = [0, 0], g = [];
      const k = () => {
        g.length >= 4 && c.push(...gt(g, i)), g = [];
      }, b = () => {
        k(), c.length && (u.push(c), c = []);
      };
      for (const { key: _, data: y } of p)
        switch (_) {
          case "M":
            b(), M = [y[0], y[1]], c.push(M);
            break;
          case "L":
            k(), c.push([y[0], y[1]]);
            break;
          case "C":
            if (!g.length) {
              const x = c.length ? c[c.length - 1] : M;
              g.push([x[0], x[1]]);
            }
            g.push([y[0], y[1]]), g.push([y[2], y[3]]), g.push([y[4], y[5]]);
            break;
          case "Z":
            k(), c.push([M[0], M[1]]);
        }
      if (b(), !d)
        return u;
      const O = [];
      for (const _ of u) {
        const y = Zt(_, d);
        y.length && O.push(y);
      }
      return O;
    }(t, 1, r ? 4 - 4 * e.simplification : (1 + e.roughness) / 2);
    return o && (e.fillStyle === "solid" ? n.push(V(l, e)) : n.push(W(l, e))), h && (r ? l.forEach((f) => {
      n.push(Z(f, !1, e));
    }) : n.push(function(f, i) {
      const d = ct(it(et(f))), p = [];
      let u = [0, 0], c = [0, 0];
      for (const { key: M, data: g } of d)
        switch (M) {
          case "M": {
            const k = 1 * (i.maxRandomnessOffset || 0), b = i.preserveVertices;
            p.push({ op: "move", data: g.map((O) => O + (b ? 0 : m(k, i))) }), c = [g[0], g[1]], u = [g[0], g[1]];
            break;
          }
          case "L":
            p.push(...A(c[0], c[1], g[0], g[1], i)), c = [g[0], g[1]];
            break;
          case "C": {
            const [k, b, O, _, y, x] = g;
            p.push(...Vt(k, b, O, _, y, x, c, i)), c = [y, x];
            break;
          }
          case "Z":
            p.push(...A(c[0], c[1], u[0], u[1], i)), c = [u[0], u[1]];
        }
      return { type: "path", ops: p };
    }(t, e))), this._d("path", n, e);
  }
  opsToPath(t, s) {
    let e = "";
    for (const n of t.ops) {
      const o = typeof s == "number" && s >= 0 ? n.data.map((h) => +h.toFixed(s)) : n.data;
      switch (n.op) {
        case "move":
          e += `M${o[0]} ${o[1]} `;
          break;
        case "bcurveTo":
          e += `C${o[0]} ${o[1]}, ${o[2]} ${o[3]}, ${o[4]} ${o[5]} `;
          break;
        case "lineTo":
          e += `L${o[0]} ${o[1]} `;
      }
    }
    return e.trim();
  }
  toPaths(t) {
    const s = t.sets || [], e = t.options || this.defaultOptions, n = [];
    for (const o of s) {
      let h = null;
      switch (o.type) {
        case "path":
          h = { d: this.opsToPath(o), stroke: e.stroke, strokeWidth: e.strokeWidth, fill: P };
          break;
        case "fillPath":
          h = { d: this.opsToPath(o), stroke: P, strokeWidth: 0, fill: e.fill || P };
          break;
        case "fillSketch":
          h = this.fillSketch(o, e);
      }
      h && n.push(h);
    }
    return n;
  }
  fillSketch(t, s) {
    let e = s.fillWeight;
    return e < 0 && (e = s.strokeWidth / 2), { d: this.opsToPath(t), stroke: s.fill || P, strokeWidth: e, fill: P };
  }
}
class Qt {
  constructor(t, s) {
    this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new J(s);
  }
  draw(t) {
    const s = t.sets || [], e = t.options || this.getDefaultOptions(), n = this.ctx, o = t.options.fixedDecimalPlaceDigits;
    for (const h of s)
      switch (h.type) {
        case "path":
          n.save(), n.strokeStyle = e.stroke === "none" ? "transparent" : e.stroke, n.lineWidth = e.strokeWidth, e.strokeLineDash && n.setLineDash(e.strokeLineDash), e.strokeLineDashOffset && (n.lineDashOffset = e.strokeLineDashOffset), this._drawToContext(n, h, o), n.restore();
          break;
        case "fillPath": {
          n.save(), n.fillStyle = e.fill || "";
          const r = t.shape === "curve" || t.shape === "polygon" || t.shape === "path" ? "evenodd" : "nonzero";
          this._drawToContext(n, h, o, r), n.restore();
          break;
        }
        case "fillSketch":
          this.fillSketch(n, h, e);
      }
  }
  fillSketch(t, s, e) {
    let n = e.fillWeight;
    n < 0 && (n = e.strokeWidth / 2), t.save(), e.fillLineDash && t.setLineDash(e.fillLineDash), e.fillLineDashOffset && (t.lineDashOffset = e.fillLineDashOffset), t.strokeStyle = e.fill || "", t.lineWidth = n, this._drawToContext(t, s, e.fixedDecimalPlaceDigits), t.restore();
  }
  _drawToContext(t, s, e, n = "nonzero") {
    t.beginPath();
    for (const o of s.ops) {
      const h = typeof e == "number" && e >= 0 ? o.data.map((r) => +r.toFixed(e)) : o.data;
      switch (o.op) {
        case "move":
          t.moveTo(h[0], h[1]);
          break;
        case "bcurveTo":
          t.bezierCurveTo(h[0], h[1], h[2], h[3], h[4], h[5]);
          break;
        case "lineTo":
          t.lineTo(h[0], h[1]);
      }
    }
    s.type === "fillPath" ? t.fill(n) : t.stroke();
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  line(t, s, e, n, o) {
    const h = this.gen.line(t, s, e, n, o);
    return this.draw(h), h;
  }
  rectangle(t, s, e, n, o) {
    const h = this.gen.rectangle(t, s, e, n, o);
    return this.draw(h), h;
  }
  ellipse(t, s, e, n, o) {
    const h = this.gen.ellipse(t, s, e, n, o);
    return this.draw(h), h;
  }
  circle(t, s, e, n) {
    const o = this.gen.circle(t, s, e, n);
    return this.draw(o), o;
  }
  linearPath(t, s) {
    const e = this.gen.linearPath(t, s);
    return this.draw(e), e;
  }
  polygon(t, s) {
    const e = this.gen.polygon(t, s);
    return this.draw(e), e;
  }
  arc(t, s, e, n, o, h, r = !1, l) {
    const f = this.gen.arc(t, s, e, n, o, h, r, l);
    return this.draw(f), f;
  }
  curve(t, s) {
    const e = this.gen.curve(t, s);
    return this.draw(e), e;
  }
  path(t, s) {
    const e = this.gen.path(t, s);
    return this.draw(e), e;
  }
}
const N = "http://www.w3.org/2000/svg";
class Ht {
  constructor(t, s) {
    this.svg = t, this.gen = new J(s);
  }
  draw(t) {
    const s = t.sets || [], e = t.options || this.getDefaultOptions(), n = this.svg.ownerDocument || window.document, o = n.createElementNS(N, "g"), h = t.options.fixedDecimalPlaceDigits;
    for (const r of s) {
      let l = null;
      switch (r.type) {
        case "path":
          l = n.createElementNS(N, "path"), l.setAttribute("d", this.opsToPath(r, h)), l.setAttribute("stroke", e.stroke), l.setAttribute("stroke-width", e.strokeWidth + ""), l.setAttribute("fill", "none"), e.strokeLineDash && l.setAttribute("stroke-dasharray", e.strokeLineDash.join(" ").trim()), e.strokeLineDashOffset && l.setAttribute("stroke-dashoffset", `${e.strokeLineDashOffset}`);
          break;
        case "fillPath":
          l = n.createElementNS(N, "path"), l.setAttribute("d", this.opsToPath(r, h)), l.setAttribute("stroke", "none"), l.setAttribute("stroke-width", "0"), l.setAttribute("fill", e.fill || ""), t.shape !== "curve" && t.shape !== "polygon" || l.setAttribute("fill-rule", "evenodd");
          break;
        case "fillSketch":
          l = this.fillSketch(n, r, e);
      }
      l && o.appendChild(l);
    }
    return o;
  }
  fillSketch(t, s, e) {
    let n = e.fillWeight;
    n < 0 && (n = e.strokeWidth / 2);
    const o = t.createElementNS(N, "path");
    return o.setAttribute("d", this.opsToPath(s, e.fixedDecimalPlaceDigits)), o.setAttribute("stroke", e.fill || ""), o.setAttribute("stroke-width", n + ""), o.setAttribute("fill", "none"), e.fillLineDash && o.setAttribute("stroke-dasharray", e.fillLineDash.join(" ").trim()), e.fillLineDashOffset && o.setAttribute("stroke-dashoffset", `${e.fillLineDashOffset}`), o;
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  opsToPath(t, s) {
    return this.gen.opsToPath(t, s);
  }
  line(t, s, e, n, o) {
    const h = this.gen.line(t, s, e, n, o);
    return this.draw(h);
  }
  rectangle(t, s, e, n, o) {
    const h = this.gen.rectangle(t, s, e, n, o);
    return this.draw(h);
  }
  ellipse(t, s, e, n, o) {
    const h = this.gen.ellipse(t, s, e, n, o);
    return this.draw(h);
  }
  circle(t, s, e, n) {
    const o = this.gen.circle(t, s, e, n);
    return this.draw(o);
  }
  linearPath(t, s) {
    const e = this.gen.linearPath(t, s);
    return this.draw(e);
  }
  polygon(t, s) {
    const e = this.gen.polygon(t, s);
    return this.draw(e);
  }
  arc(t, s, e, n, o, h, r = !1, l) {
    const f = this.gen.arc(t, s, e, n, o, h, r, l);
    return this.draw(f);
  }
  curve(t, s) {
    const e = this.gen.curve(t, s);
    return this.draw(e);
  }
  path(t, s) {
    const e = this.gen.path(t, s);
    return this.draw(e);
  }
}
var Mt = { canvas: (a, t) => new Qt(a, t), svg: (a, t) => new Ht(a, t), generator: (a) => new J(a), newSeed: () => J.newSeed() };
const Ot = (a, t) => {
  const s = a.__vccOpts || a;
  for (const [e, n] of t)
    s[e] = n;
  return s;
}, Bt = {
  name: "RoughCanvas",
  props: {
    width: String,
    height: String,
    config: Object
  },
  setup(a) {
    const t = tt(null), s = tt(null), e = () => {
      t.value.getContext("2d").clearRect(0, 0, t.value.width, t.value.height);
    };
    return mt(() => {
      s.value = Mt.canvas(t.value, a.config), ht("rough", s.value), ht("clearCanvas", e);
    }), bt(() => a.config, () => {
      s.value = Mt.canvas(t.value, a.config);
    }, { deep: !0 }), {
      rough: s,
      canvasRef: t,
      clearCanvas: e
    };
  }
}, Ut = ["width", "height"];
function Jt(a, t, s, e, n, o) {
  return Lt(), Tt("canvas", {
    ref: "canvasRef",
    width: s.width,
    height: s.height
  }, [
    e.rough ? Dt(a.$slots, "default", { key: 0 }) : Ct("", !0)
  ], 8, Ut);
}
const Kt = /* @__PURE__ */ Ot(Bt, [["render", Jt]]);
function Xt(a) {
  const t = tt(null), s = yt("rough"), e = (n, o, h = !1) => {
    const r = Object.assign(
      {},
      ...Object.entries(a).map(([l, f]) => f !== void 0 && { [l]: f })
    );
    if (h) {
      s[n](...o, r);
      return;
    }
    s.svg && (t.value && s.remove(t.value), t.value = s[n](...o, r));
  };
  return bt(() => a, () => {
    e();
  }, { deep: !0 }), e(), At(() => {
    s.svg && t.value && s.remove(t.value);
  }), {
    element: t,
    createElement: e
  };
}
const Yt = {
  name: "RoughEllipse",
  props: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
    // ...other props
  },
  setup(a) {
    yt("clearCanvas");
    const { createElement: t } = Xt(a), s = (e = !1) => {
      t("ellipse", [a.x, a.y, a.width, a.height], e);
    };
    return mt(() => {
      s(!0);
    }), It(() => {
      s(!0);
    }), {
      handler: s
    };
  }
};
function te(a, t, s, e, n, o) {
  return null;
}
const ee = /* @__PURE__ */ Ot(Yt, [["render", te]]), kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RoughCanvas: Kt,
  RoughEllipse: ee
}, Symbol.toStringTag, { value: "Module" }));
function ne(a) {
  Object.keys(kt).forEach((t) => {
    a.component(t, kt[t]);
  });
}
export {
  Kt as RoughCanvas,
  ee as RoughEllipse,
  ne as default,
  ne as install
};
