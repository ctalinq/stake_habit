/// <reference types="vitest" />

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./wrappers/index.ts",
      name: "ContractWrappers",
    },
  },
  plugins: [dts()],
});
