import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";
import { logInfo } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDirectory = path.join(__dirname, "migrations");

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function appliedMigrationNames() {
  const result = await pool.query<{ filename: string }>(
    "SELECT filename FROM schema_migrations ORDER BY filename ASC"
  );

  return new Set(result.rows.map((row) => row.filename));
}

export async function runMigrations() {
  await ensureMigrationsTable();

  const files = (await readdir(migrationsDirectory))
    .filter((file) => file.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right));

  const applied = await appliedMigrationNames();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }

    const sql = await readFile(path.join(migrationsDirectory, file), "utf8");

    logInfo("Applying migration", { file });

    await pool.query("BEGIN");

    try {
      await pool.query(sql);
      await pool.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [
        file
      ]);
      await pool.query("COMMIT");
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }

  logInfo("Database migrations complete", {
    database: process.env.DB_NAME || "gdgocode_cloud_track"
  });
}
