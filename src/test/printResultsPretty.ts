import { SuiteResult } from "./type/SuiteResult";

export function printResultsPretty(
  suites: SuiteResult[],
  options: Partial<{ console: Console }> = {}
) {
  const emoji = {
    passed: "✅",
    failed: "❌",
    timeout: "⏱️",
    pending: "⏳",
    celebration: "🎉",
    unhappy: "😢",
  } as const;

  for (const suite of suites) {
    console.groupCollapsed(
      `%c🧪 Suite: ${suite.name}`,
      "font-weight: bold; color: #5e9eff"
    );

    for (const result of suite.results) {
      const colorMap = {
        passed: "color: green;",
        failed: "color: red;",
        timeout: "color: orange;",
        pending: "color: gray;",
      };

      const emojiChar = emoji[result.status];
      const style = `font-weight: bold; ${colorMap[result.status]}`;

      const durationStr =
        result.durationMs !== undefined ? ` (${result.durationMs} ms)` : "";

      console.groupCollapsed(
        `%c${emojiChar} ${result.description}${durationStr}`,
        style
      );

      if (result.status === "failed" || result.status === "timeout") {
        console.error(result.error);
      }

      console.groupEnd(); // test
    }

    console.groupEnd(); // suite
  }

  const summary = suites.flatMap((s) => s.results);
  const passed = summary.filter((r) => r.status === "passed").length;
  const failed = summary.filter((r) => r.status === "failed").length;
  const timedOut = summary.filter((r) => r.status === "timeout").length;
  const totalTime = summary.reduce((acc, r) => acc + (r.durationMs ?? 0), 0);

  const summaryMood =
    failed > 0 || timedOut > 0 ? emoji["unhappy"] : emoji["celebration"];

  const { console: customConsole = console } = options;
  customConsole.log(
    `%c${summaryMood} Summary: %c${passed} passed, %c${failed} failed, %c${timedOut} timed out, ⏱️ %c${totalTime} ms total`,
    "font-weight: bold;",
    "color: green; font-weight: bold;",
    "color: red; font-weight: bold;",
    "color: orange; font-weight: bold;",
    "color: cyan; font-weight: bold;"
  );
}
