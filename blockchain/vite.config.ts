/// <reference types="vitest" />

import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        commiterContract: path.resolve(
          __dirname,
          "wrappers/CommiterContract.ts"
        ),
        commitmentContract: path.resolve(
          __dirname,
          "wrappers/CommitmentContract.ts"
        ),
        utils: path.resolve(__dirname, "wrappers/utils.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["@ton/core"],
    },
  },
  plugins: [
    dts({
      tsconfigPath: path.resolve(__dirname, "tsconfig.vite.json"),
    }),
  ],
});
