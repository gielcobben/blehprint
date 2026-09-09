import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      persistState: { path: "../../.wrangler/state" },
      // Runs the API worker in the same dev server so the service binding works locally.
      auxiliaryWorkers: [{ configPath: "../api/wrangler.jsonc" }],
    }),
    tailwindcss(),
    reactRouter(),
  ],
});
