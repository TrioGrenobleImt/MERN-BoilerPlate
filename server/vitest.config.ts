import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    maxConcurrency: 1,
    coverage: {
      exclude: ["index.js"],
    },
  },
});
