import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    //todo - to env
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: ["devalchemy.online"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"), // 👈 ЭТО ОБЯЗАТЕЛЬНО
    },
  },
});
