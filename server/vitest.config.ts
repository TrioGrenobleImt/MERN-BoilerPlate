import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    maxConcurrency: 1,
    fileParallelism: false,
    coverage: {
      exclude: ["index.js", "vitest.config.ts", "**/tests/**", "**/uploads/**"],
    },
  },
});
