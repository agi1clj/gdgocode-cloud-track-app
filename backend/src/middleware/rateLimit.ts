import type { NextFunction, Request, Response } from "express";

type Entry = {
  count: number;
  resetAt: number;
};

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || "60000");
const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS || "120");
const store = new Map<string, Entry>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.ip || "unknown";
}

export function apiRateLimit(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const now = Date.now();
  const key = getClientKey(request);
  const current = store.get(key);

  if (!current || now > current.resetAt) {
    store.set(key, {
      count: 1,
      resetAt: now + windowMs
    });
    next();
    return;
  }

  if (current.count >= maxRequests) {
    response.status(429).json({
      error: "Too many requests. Please wait a moment and try again."
    });
    return;
  }

  current.count += 1;
  next();
}
