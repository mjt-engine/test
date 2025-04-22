import type { ExpectStatic } from "@vitest/expect";
import { CtxMapper } from "./type/Ctx";
import { SuiteResult } from "./type/SuiteResult";
export declare function Tests<T>({ ctxMapper, defaultTimeoutMs, }?: Partial<{
    ctxMapper: CtxMapper<T>;
    defaultTimeoutMs: number;
}>): {
    describe: (name: string, fn: () => void) => void;
    test: (description: string, fn: (ctx: T) => void | Promise<void>, options?: {
        timeoutMs?: number;
    }) => void;
    expect: ExpectStatic;
    runTests: () => Promise<SuiteResult[]>;
    printResultsPretty: () => void;
};
