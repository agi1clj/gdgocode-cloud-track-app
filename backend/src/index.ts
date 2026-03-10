import "dotenv/config";
import { createApp } from "./app.js";
import { verifyDatabaseConnection } from "./db.js";
import { getErrorMessage, getErrorStack, logError, logInfo } from "./logger.js";
import { runMigrations } from "./migrations.js";

const port = Number(process.env.PORT || "8080");
const app = createApp();

async function start() {
  await runMigrations();
  await verifyDatabaseConnection();

  app.listen(port, () => {
    logInfo("API listening", {
      port,
      environment: process.env.NODE_ENV || "development"
    });
  });
}

start().catch((error) => {
  logError("Failed to start backend", {
    error: getErrorMessage(error),
    stack: getErrorStack(error)
  });
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  logError("Unhandled promise rejection", {
    error: getErrorMessage(error),
    stack: getErrorStack(error)
  });
});

process.on("uncaughtException", (error) => {
  logError("Uncaught exception", {
    error: getErrorMessage(error),
    stack: getErrorStack(error)
  });
  process.exit(1);
});
