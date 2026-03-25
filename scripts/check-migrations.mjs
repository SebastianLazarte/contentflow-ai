import { readdir } from "node:fs/promises";
import path from "node:path";

const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
const migrationPattern = /^(\d{12,})_.+\.sql$/;

async function main() {
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name);

  if (files.length === 0) {
    throw new Error("No SQL migrations found in supabase/migrations.");
  }

  const invalid = files.filter((file) => !migrationPattern.test(file));
  if (invalid.length > 0) {
    throw new Error(
      `Invalid migration names: ${invalid.join(", ")}. Expected format <timestamp>_<name>.sql`
    );
  }

  const prefixes = files.map((file) => file.match(migrationPattern)?.[1] ?? "");
  const duplicatePrefixes = prefixes.filter(
    (prefix, index) => prefixes.indexOf(prefix) !== index
  );
  if (duplicatePrefixes.length > 0) {
    throw new Error(
      `Duplicate migration prefixes found: ${[...new Set(duplicatePrefixes)].join(", ")}`
    );
  }

  const sorted = [...files].sort((a, b) => a.localeCompare(b));
  process.stdout.write(`Migrations OK (${sorted.length})\n`);
  for (const file of sorted) {
    process.stdout.write(`${file}\n`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
