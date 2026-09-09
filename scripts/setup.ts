/**
 * One-time local setup: creates workers/api/.dev.vars with a fresh secret,
 * generates types, and applies the database migrations locally.
 * Safe to re-run; it never overwrites an existing .dev.vars.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";

const root = join(import.meta.dirname, "..");
const devVars = join(root, "workers/api/.dev.vars");

/** Run a command quietly; on failure print its output and stop. */
async function run(...command: string[]) {
  const result = await $`${command}`.cwd(root).nothrow().quiet();
  if (result.exitCode !== 0) {
    console.error(result.stdout.toString(), result.stderr.toString());
    console.error(
      `\n✗ "${command.join(" ")}" failed. Fix the error above and re-run: bun run setup`,
    );
    process.exit(result.exitCode);
  }
}

if (existsSync(devVars)) {
  console.log("  keep     workers/api/.dev.vars (already exists)");
} else {
  const example = await Bun.file(join(root, "workers/api/.dev.vars.example")).text();
  const secret = Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64");
  await Bun.write(
    devVars,
    example.replace("BETTER_AUTH_SECRET=replace-me", `BETTER_AUTH_SECRET=${secret}`),
  );
  console.log("  created  workers/api/.dev.vars");
}

console.log("  types    wrangler types + react-router typegen");
await run("bun", "run", "--filter", "./workers/*", "cf:typegen");

console.log("  migrate  local D1");
await run("bun", "run", "db:migrate:local");

console.log("\n✓ Ready. Start the app with: bun run dev\n");
