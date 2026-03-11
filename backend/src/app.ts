import cors from "cors";
import { randomUUID } from "node:crypto";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./docs/openapi.js";
import { getErrorMessage, getErrorStack, logError, logInfo } from "./logger.js";
import { apiRateLimit } from "./middleware/rateLimit.js";
import { eventsRouter } from "./routes/events.js";
import { healthRouter } from "./routes/health.js";

export function createApp() {
  const app = express();

  app.use((request, response, next) => {
    const startedAt = Date.now();
    const requestId = request.header("x-request-id") || randomUUID();

    response.locals.requestId = requestId;
    response.setHeader("x-request-id", requestId);

    response.on("finish", () => {
      logInfo("HTTP request completed", {
        requestId,
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
        durationMs: Date.now() - startedAt
      });
    });

    next();
  });

  app.use(express.json());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*"
    })
  );
  app.use("/api", apiRateLimit);

  app.get("/", (_request, response) => {
    response.status(200).json({
      status: "ok",
      message: "Service is up"
    });
  });

  app.get("/openapi.json", (_request, response) => {
    response.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.setHeader("Pragma", "no-cache");
    response.setHeader("Expires", "0");
    response.json(openApiDocument);
  });

  app.use(
    "/docs",
    (
      _request: express.Request,
      response: express.Response,
      next: express.NextFunction
    ) => {
      response.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.setHeader("Pragma", "no-cache");
      response.setHeader("Expires", "0");
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      customSiteTitle: "GDGoCode Cloud Track API Docs",
      explorer: true,
      swaggerOptions: {
        url: "/openapi.json"
      }
    })
  );

  app.use("/api/health", healthRouter);
  app.use("/api/events", eventsRouter);

  app.use((request, response) => {
    response.status(404).json({
      error: "Route not found",
      requestId: response.locals.requestId || request.header("x-request-id")
    });
  });

  app.use(
    (
      error: Error,
      request: express.Request,
      response: express.Response,
      _next: express.NextFunction
    ) => {
      logError("Request failed", {
        requestId: response.locals.requestId || request.header("x-request-id"),
        method: request.method,
        path: request.originalUrl,
        statusCode: 500,
        error: getErrorMessage(error),
        stack: getErrorStack(error)
      });

      response.status(500).json({
        error: "Internal server error",
        requestId: response.locals.requestId || request.header("x-request-id")
      });
    }
  );

  return app;
}
