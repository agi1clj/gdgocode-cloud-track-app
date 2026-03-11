import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PoolClient } from "pg";
import { pool } from "./db.js";
import { logInfo } from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDirectory = path.join(__dirname, "migrations");
const migrationLockKey = 20260311;

async function ensureMigrationsTable(client: PoolClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function appliedMigrationNames(client: PoolClient) {
  const result = await client.query<{ filename: string }>(
    "SELECT filename FROM schema_migrations ORDER BY filename ASC"
  );

  return new Set(result.rows.map((row) => row.filename));
}

export async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query("SELECT pg_advisory_lock($1)", [migrationLockKey]);
    await ensureMigrationsTable(client);

    const files = (await readdir(migrationsDirectory))
      .filter((file) => file.endsWith(".sql"))
      .sort((left, right) => left.localeCompare(right));

    const applied = await appliedMigrationNames(client);

    for (const file of files) {
      if (applied.has(file)) {
        continue;
      }

      const sql = await readFile(path.join(migrationsDirectory, file), "utf8");

      logInfo("Applying migration", { file });

      await client.query("BEGIN");

      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );
        await client.query("COMMIT");
        applied.add(file);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    logInfo("Database migrations complete", {
      database: process.env.DB_NAME || "gdgocode_cloud_track"
    });
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock($1)", [migrationLockKey]);
    } finally {
      client.release();
    }
  }
}
