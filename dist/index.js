import { JestExtend as $, JestChaiExpect as M, JestAsymmetricMatchers as P } from "@vitest/expect";
import * as d from "chai";
function E(c) {
  const u = {
    passed: "✅",
    failed: "❌",
    timeout: "⏱️",
    pending: "⏳",
    celebration: "🎉",
    unhappy: "😢"
  };
  for (const e of c) {
    console.groupCollapsed(
      `%c🧪 Suite: ${e.name}`,
      "font-weight: bold; color: #5e9eff"
    );
    for (const t of e.results) {
      const n = {
        passed: "color: green;",
        failed: "color: red;",
        timeout: "color: orange;",
        pending: "color: gray;"
      }, i = u[t.status], r = `font-weight: bold; ${n[t.status]}`, p = t.durationMs !== void 0 ? ` (${t.durationMs} ms)` : "";
      console.groupCollapsed(
        `%c${i} ${t.description}${p}`,
        r
      ), (t.status === "failed" || t.status === "timeout") && console.error(t.error), console.groupEnd();
    }
    console.groupEnd();
  }
  const o = c.flatMap((e) => e.results), l = o.filter((e) => e.status === "passed").length, a = o.filter((e) => e.status === "failed").length, s = o.filter((e) => e.status === "timeout").length, m = o.reduce((e, t) => e + (t.durationMs ?? 0), 0), f = a > 0 || s > 0 ? u.unhappy : u.celebration;
  console.log(
    `%c${f} Summary: %c${l} passed, %c${a} failed, %c${s} timed out, ⏱️ %c${m} ms total`,
    "font-weight: bold;",
    "color: green; font-weight: bold;",
    "color: red; font-weight: bold;",
    "color: orange; font-weight: bold;",
    "color: cyan; font-weight: bold;"
  );
}
function x({
  ctxMapper: c,
  defaultTimeoutMs: u = 5e3
} = {}) {
  const o = [], l = [];
  d.use($), d.use(M), d.use(P);
  const a = d.expect;
  let s = null;
  function m(t, n) {
    const i = { name: t, results: [] };
    s = i, o.push(i), n(), s = null;
  }
  function f(t, n, i) {
    if (!s) throw new Error("test() called outside of describe()");
    const r = { description: t, status: "pending" };
    s.results.push(r);
    const p = i?.timeoutMs ?? u, h = performance.now(), w = new Promise(
      (g, b) => setTimeout(() => b(new Error("Test timed out")), p)
    ), y = () => Promise.race([
      Promise.resolve().then(() => c ? c(n) : n(void 0)),
      w
    ]).then(() => {
      r.status = "passed";
    }).catch((g) => {
      r.status = g?.message === "Test timed out" ? "timeout" : "failed", r.error = g;
    }).finally(() => {
      r.durationMs = Math.round(performance.now() - h);
    });
    l.push(y);
  }
  async function e() {
    for (const t of l)
      await t();
    return o;
  }
  return {
    describe: m,
    test: f,
    expect: a,
    runTests: e,
    printResultsPretty: () => E(o)
  };
}
export {
  x as Tester
};
