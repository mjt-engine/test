import type { ExpectStatic } from "@vitest/expect";
import {
  JestAsymmetricMatchers,
  JestChaiExpect,
  JestExtend,
} from "@vitest/expect";
import * as chai from "chai";
import { CtxMapper } from "./type/Ctx";
import { printResultsPretty } from "./printResultsPretty";
import { SuiteResult } from "./type/SuiteResult";
import { TestResult } from "./type/TestResult";

export function Tests<T>({
  ctxMapper,
  defaultTimeoutMs = 5000,
}: Partial<{ ctxMapper: CtxMapper<T>; defaultTimeoutMs: number }> = {}) {
  const suites: SuiteResult[] = [];
  const testPromises: (() => Promise<void>)[] = [];
  // allows using expect.extend instead of chai.use to extend plugins
  chai.use(JestExtend);
  // adds all jest matchers to expect
  chai.use(JestChaiExpect);
  // adds asymmetric matchers like stringContaining, objectContaining
  chai.use(JestAsymmetricMatchers);

  const expect = chai.expect as unknown as ExpectStatic;
  let currentSuite: SuiteResult | null = null;

  function describe(name: string, fn: () => void) {
    const suite: SuiteResult = { name, results: [] };
    currentSuite = suite;
    suites.push(suite);
    fn();
    currentSuite = null;
  }

  function test(
    description: string,
    fn: (ctx: T) => void | Promise<void>,
    options?: { timeoutMs?: number }
  ) {
    if (!currentSuite) throw new Error("test() called outside of describe()");

    const result: TestResult = { description, status: "pending" };
    currentSuite.results.push(result);

    const timeoutMs = options?.timeoutMs ?? defaultTimeoutMs;
    const start = performance.now(); // <-- start timing

    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Test timed out")), timeoutMs)
    );

    const testPromise = () =>
      Promise.race([
        Promise.resolve().then(() => {
          if (ctxMapper) {
            return ctxMapper(fn);
          }
          return fn(undefined!);
        }),
        timeoutPromise,
      ])
        .then(() => {
          result.status = "passed";
        })
        .catch((err) => {
          result.status =
            err?.message === "Test timed out" ? "timeout" : "failed";
          result.error = err;
        })
        .finally(() => {
          result.durationMs = Math.round(performance.now() - start); // <-- end timing
        });

    testPromises.push(testPromise);
  }

  async function runTests(): Promise<SuiteResult[]> {
    for (const testPromise of testPromises) {
      await testPromise();
    }
    return suites;
  }

  return {
    describe,
    test,
    expect,
    runTests,
    printResultsPretty: () => printResultsPretty(suites),
  };
}
