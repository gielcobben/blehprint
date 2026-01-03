import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: { port: 3000 },
  resolve: {
    alias: {
      "@blehprint/ui/globals.css": resolve(
        __dirname,
        "../../packages/ui/src/styles/globals.css"
      ),
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      persistState: { path: "../../.wrangler/state" },
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
