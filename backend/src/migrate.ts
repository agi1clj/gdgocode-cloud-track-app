import "dotenv/config";
import { pool } from "./db.js";
import { getErrorMessage, getErrorStack, logError } from "./logger.js";
import { runMigrations } from "./migrations.js";

runMigrations()
  .catch((error) => {
    logError("Migration execution failed", {
      error: getErrorMessage(error),
      stack: getErrorStack(error)
    });
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
