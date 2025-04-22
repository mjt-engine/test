import { JestExtend as $, JestChaiExpect as M, JestAsymmetricMatchers as P } from "@vitest/expect";
import * as l from "chai";
function E(c, a = {}) {
  const e = {
    passed: "✅",
    failed: "❌",
    timeout: "⏱️",
    pending: "⏳",
    celebration: "🎉",
    unhappy: "😢"
  };
  for (const t of c) {
    console.groupCollapsed(
      `%c🧪 Suite: ${t.name}`,
      "font-weight: bold; color: #5e9eff"
    );
    for (const o of t.results) {
      const i = {
        passed: "color: green;",
        failed: "color: red;",
        timeout: "color: orange;",
        pending: "color: gray;"
      }, p = e[o.status], g = `font-weight: bold; ${i[o.status]}`, h = o.durationMs !== void 0 ? ` (${o.durationMs} ms)` : "";
      console.groupCollapsed(
        `%c${p} ${o.description}${h}`,
        g
      ), (o.status === "failed" || o.status === "timeout") && console.error(o.error), console.groupEnd();
    }
    console.groupEnd();
  }
  const s = c.flatMap((t) => t.results), d = s.filter((t) => t.status === "passed").length, r = s.filter((t) => t.status === "failed").length, u = s.filter((t) => t.status === "timeout").length, m = s.reduce((t, o) => t + (o.durationMs ?? 0), 0), f = r > 0 || u > 0 ? e.unhappy : e.celebration, { console: n = console } = a;
  n.log(
    `%c${f} Summary: %c${d} passed, %c${r} failed, %c${u} timed out, ⏱️ %c${m} ms total`,
    "font-weight: bold;",
    "color: green; font-weight: bold;",
    "color: red; font-weight: bold;",
    "color: orange; font-weight: bold;",
    "color: cyan; font-weight: bold;"
  );
}
function C({
  ctxMapper: c,
  defaultTimeoutMs: a = 5e3
} = {}) {
  const e = [], s = [];
  l.use($), l.use(M), l.use(P);
  const d = l.expect;
  let r = null;
  function u(n, t) {
    const o = { name: n, results: [] };
    r = o, e.push(o), t(), r = null;
  }
  function m(n, t, o) {
    if (!r) throw new Error("test() called outside of describe()");
    const i = { description: n, status: "pending" };
    r.results.push(i);
    const p = o?.timeoutMs ?? a, g = performance.now(), h = new Promise(
      (w, b) => setTimeout(() => b(new Error("Test timed out")), p)
    ), y = () => Promise.race([
      Promise.resolve().then(() => c ? c(t) : t(void 0)),
      h
    ]).then(() => {
      i.status = "passed";
    }).catch((w) => {
      i.status = w?.message === "Test timed out" ? "timeout" : "failed", i.error = w;
    }).finally(() => {
      i.durationMs = Math.round(performance.now() - g);
    });
    s.push(y);
  }
  async function f() {
    for (const n of s)
      await n();
    return e;
  }
  return {
    describe: u,
    test: m,
    expect: d,
    runTests: f,
    printResultsPretty: () => E(e)
  };
}
export {
  C as Tests
};
