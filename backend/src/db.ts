import { Pool } from "pg";
import { getErrorMessage, getErrorStack, logError, logInfo } from "./logger.js";

const sslEnabled = process.env.DB_SSL === "true";

export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "gdgocode_cloud_track",
  user: process.env.DB_USER || "gdgocode_user",
  password: process.env.DB_PASSWORD || "gdgocode_pass",
  ssl: sslEnabled ? { rejectUnauthorized: false } : undefined
});

pool.on("error", (error) => {
  logError("PostgreSQL pool error", {
    error: getErrorMessage(error),
    stack: getErrorStack(error)
  });
});

export async function verifyDatabaseConnection() {
  await pool.query("SELECT 1");

  logInfo("Database connection verified", {
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "gdgocode_cloud_track"
  });
}
