import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    maxConcurrency: 1,
    fileParallelism: false,
    setupFiles: "./vitest.setup.ts",
    coverage: {
      provider: "v8",
      exclude: ["index.js", "vitest.config.ts", "**/uploads/**"],
      reportsDirectory: "./coverage",
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },
  },
});
