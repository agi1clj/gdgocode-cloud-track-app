type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function writeLog(level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context
  };

  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export function logInfo(message: string, context?: LogContext) {
  writeLog("info", message, context);
}

export function logWarn(message: string, context?: LogContext) {
  writeLog("warn", message, context);
}

export function logError(message: string, context?: LogContext) {
  writeLog("error", message, context);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

export function getErrorStack(error: unknown) {
  return error instanceof Error ? error.stack : undefined;
}
