import path from "node:path";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const migrations = await readD1Migrations(
    path.join(import.meta.dirname, "../../packages/database/migrations"),
  );
  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          bindings: {
            BETTER_AUTH_SECRET: "u7Kp2xQ9vL4mN8bR3sT6wY1zA5cE0fH2jD4gV7hX9kM=",
            WEB_URL: "http://localhost:3000",
            TEST_MIGRATIONS: migrations,
          },
        },
      }),
    ],
    test: { setupFiles: ["./test/setup.ts"] },
  };
});
