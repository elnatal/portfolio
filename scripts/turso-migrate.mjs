/**
 * Applies all pending migrations to the Turso database directly via the libsql client.
 * Run once with: node scripts/turso-migrate.mjs
 */
import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

if (!TURSO_DATABASE_URL) {
  console.error("❌  TURSO_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const client = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

// Ensure the migrations tracking table exists
await client.execute(`
  CREATE TABLE IF NOT EXISTS _prisma_migrations (
    id                TEXT    PRIMARY KEY NOT NULL,
    checksum          TEXT    NOT NULL,
    finished_at       DATETIME,
    migration_name    TEXT    UNIQUE NOT NULL,
    logs              TEXT,
    rolled_back_at    DATETIME,
    started_at        DATETIME NOT NULL DEFAULT current_timestamp,
    applied_steps_count INTEGER NOT NULL DEFAULT 0
  )
`);

const migrationsDir = resolve("prisma/migrations");
const folders = readdirSync(migrationsDir)
  .filter((f) => !f.startsWith("."))
  .sort();

for (const folder of folders) {
  const sqlPath = join(migrationsDir, folder, "migration.sql");
  let sql;
  try {
    sql = readFileSync(sqlPath, "utf8");
  } catch {
    continue; // skip folders without migration.sql
  }

  // Check if already applied
  const existing = await client.execute({
    sql: "SELECT id FROM _prisma_migrations WHERE migration_name = ?",
    args: [folder],
  });

  if (existing.rows.length > 0) {
    console.log(`⏭  ${folder} — already applied`);
    continue;
  }

  console.log(`⚡  Applying ${folder}...`);
  // Strip comment lines, split on semicolons, run each statement individually
  const stripped = sql.replace(/--[^\n]*/g, "").replace(/\n+/g, "\n");
  const statements = stripped
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    await client.execute(stmt);
  }

  await client.execute({
    sql: `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, applied_steps_count)
          VALUES (lower(hex(randomblob(16))), '', datetime('now'), ?, 1)`,
    args: [folder],
  });

  console.log(`✅  ${folder} — done`);
}

console.log("\n🎉  Turso database is up to date.");
client.close();
