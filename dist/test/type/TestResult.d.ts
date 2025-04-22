import { TestStatus } from "./TestStatus";
export type TestResult = {
    description: string;
    status: TestStatus;
    error?: unknown;
    durationMs?: number;
};
