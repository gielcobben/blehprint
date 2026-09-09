/**
 * Renames the project from "blehprint" to the given name in every source and
 * config file, then removes itself. Run once, right after cloning.
 */
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

const OLD_NAME = "blehprint";
const OLD_DISPLAY_NAME = "Blehprint";
const newName = process.argv[2];

if (!newName) {
  console.error("Usage: bun run rename <new-name>\nExample: bun run rename my-app");
  process.exit(1);
}
if (!/^[a-z][a-z0-9-]*$/.test(newName)) {
  console.error("Name must be lowercase letters, numbers and hyphens, starting with a letter.");
  process.exit(1);
}
if (newName === OLD_NAME) {
  console.log("Nothing to rename.");
  process.exit(0);
}

/** "my-cool-app" → "My Cool App", used where the template shows "Blehprint" to users. */
const newDisplayName = newName
  .split("-")
  .map((word) => word[0]?.toUpperCase() + word.slice(1))
  .join(" ");

const EXTENSIONS = new Set([".json", ".jsonc", ".ts", ".tsx", ".css", ".md", ".sql"]);
const SKIP = new Set(["node_modules", ".git", ".wrangler", ".react-router", "build", "migrations"]);

async function* walk(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.has(extname(entry.name))) yield path;
  }
}

const root = join(import.meta.dirname, "..");
let changed = 0;

for await (const file of walk(root)) {
  const before = await readFile(file, "utf8");
  const after = before.replaceAll(OLD_NAME, newName).replaceAll(OLD_DISPLAY_NAME, newDisplayName);
  if (after !== before) {
    await writeFile(file, after);
    changed++;
    console.log(`  updated  ${file.slice(root.length + 1)}`);
  }
}

// This script is one-time: remove it and its package.json entry.
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(await readFile(pkgPath, "utf8"));
delete pkg.scripts.rename;
await writeFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
await rm(join(root, "scripts/rename.ts"));
console.log("  removed  scripts/rename.ts");

console.log(`\n✓ Renamed ${OLD_NAME} → ${newName} in ${changed} files.`);
console.log("\nNext: bun install && bun run setup && bun run dev\n");
