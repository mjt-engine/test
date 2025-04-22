import { TestResult } from "./TestResult";
export type SuiteResult = {
    name: string;
    results: TestResult[];
};
