/**
 * Copies all rows from the local dev.db SQLite file to Turso.
 * Run once with: node scripts/sqlite-to-turso.mjs
 *
 * Uses @libsql/client for both source (file:) and destination (libsql:)
 * so no extra packages are needed.
 */
import { createClient } from "@libsql/client";
import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: ".env.local" });

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } = process.env;

if (!TURSO_DATABASE_URL) {
  console.error("❌  TURSO_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const localPath = resolve("prisma/dev.db");
const local = createClient({ url: `file:${localPath}` });
const remote = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

// Tables in dependency order (parents before children)
const TABLES = [
  "PersonalInfo",
  "Experience",
  "Project",
  "Skill",
  "Education",
  "Certification",
  "Language",
  "ContactMessage",
];

let totalInserted = 0;

for (const table of TABLES) {
  // Check if table exists in local DB
  const exists = await local.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [table]
  );
  if (exists.rows.length === 0) {
    console.log(`⏭  ${table} — not found in local DB, skipping`);
    continue;
  }

  const rows = await local.execute(`SELECT * FROM "${table}"`);
  if (rows.rows.length === 0) {
    console.log(`⏭  ${table} — empty`);
    continue;
  }

  const columns = rows.columns;
  const placeholders = columns.map(() => "?").join(", ");
  const insertSql = `INSERT OR IGNORE INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`;

  let inserted = 0;
  for (const row of rows.rows) {
    const values = columns.map((col) => {
      const val = row[col];
      // Convert boolean-like integers back (libsql returns them as numbers)
      return val;
    });
    try {
      await remote.execute({ sql: insertSql, args: values });
      inserted++;
    } catch (err) {
      console.warn(`  ⚠  ${table} row skipped: ${err.message}`);
    }
  }

  console.log(`✅  ${table} — ${inserted}/${rows.rows.length} rows copied`);
  totalInserted += inserted;
}

console.log(`\n🎉  Done! ${totalInserted} rows copied to Turso.`);

local.close();
remote.close();
