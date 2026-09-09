/**
 * One-time local setup: creates workers/api/.dev.vars with a fresh secret,
 * generates types, and applies the database migrations locally.
 * Safe to re-run; it never overwrites an existing .dev.vars.
 */
import { $ } from "bun";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const devVars = join(root, "workers/api/.dev.vars");

if (existsSync(devVars)) {
  console.log("  keep     workers/api/.dev.vars (already exists)");
} else {
  const example = await Bun.file(join(root, "workers/api/.dev.vars.example")).text();
  const secret = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64");
  await Bun.write(devVars, example.replace("BETTER_AUTH_SECRET=replace-me", `BETTER_AUTH_SECRET=${secret}`));
  console.log("  created  workers/api/.dev.vars");
}

console.log("  types    wrangler types + react-router typegen");
await $`bun run --filter './workers/*' cf:typegen`.cwd(root).quiet();

console.log("  migrate  local D1");
await $`bun run db:migrate:local`.cwd(root).quiet();

console.log("\n✓ Ready. Start the app with: bun run dev\n");
