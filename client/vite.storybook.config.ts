import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), tsconfigPaths(), svgr()],
  server: {
    //todo - to env
    host: "0.0.0.0",
    port: 6666,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
});
