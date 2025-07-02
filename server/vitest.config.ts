import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    maxConcurrency: 1,
    fileParallelism: false,
    setupFiles: "./vitest.setup.ts",
    coverage: {
      exclude: ["src/index.ts", "vitest.config.ts", "**/uploads/**", "src/interfaces/**", "src/types/**"],
    },
  },
});
