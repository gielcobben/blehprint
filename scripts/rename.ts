import { readdir, readFile, writeFile, rm } from "node:fs/promises";
import { join, extname } from "node:path";

const OLD_NAME = "blehprint";
const newName = process.argv[2];

if (!newName) {
	console.error("Usage: bun run rename <new-name>");
	console.error('Example: bun run rename my-cool-app');
	process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(newName)) {
	console.error(
		"Name must start with a lowercase letter and contain only lowercase letters, numbers, and hyphens.",
	);
	process.exit(1);
}

if (newName === OLD_NAME) {
	console.log("Nothing to rename — the name is already set.");
	process.exit(0);
}

const EXTENSIONS = new Set([
	".json",
	".jsonc",
	".ts",
	".tsx",
	".css",
	".md",
	".sql",
]);

const SKIP_DIRS = new Set([
	"node_modules",
	".git",
	".wrangler",
	".react-router",
	".turbo",
	".next",
]);

async function* walk(dir: string): AsyncGenerator<string> {
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			yield* walk(full);
		} else if (EXTENSIONS.has(extname(entry.name))) {
			yield full;
		}
	}
}

const root = join(import.meta.dirname, "..");
let filesChanged = 0;

for await (const file of walk(root)) {
	const content = await readFile(file, "utf-8");
	const updated = content.replaceAll(OLD_NAME, newName);

	if (updated !== content) {
		await writeFile(file, updated);
		filesChanged++;
		console.log(`  updated  ${file.replace(root + "/", "")}`);
	}
}

// Remove the rename script and its parent dir — it's a one-time operation
await rm(join(root, "scripts"), { recursive: true, force: true });
filesChanged++;
console.log("  removed  scripts/rename.ts");

console.log(`\n✓ Renamed ${OLD_NAME} → ${newName} in ${filesChanged} files.\n`);
console.log("Next steps:");
console.log("  1. bun install");
console.log("  2. cp workers/web/.dev.vars.example workers/web/.dev.vars");
console.log("  3. openssl rand -base64 32");
console.log("     Add the output to .dev.vars as BETTER_AUTH_SECRET");
console.log("  4. bun run db:migrate:local");
console.log("  5. bun run dev:web");
