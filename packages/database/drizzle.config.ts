import { readdirSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

/** Local D1 SQLite file created by `wrangler dev` / `db:migrate:local`, for Drizzle Studio. */
function localDatabase() {
  const dir = "../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject";
  try {
    const file = readdirSync(dir).find((name) => name.endsWith(".sqlite"));
    if (file) return `${dir}/${file}`;
  } catch {}
  return undefined;
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: { url: localDatabase() ?? "" },
});
