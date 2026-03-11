import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const eventSchema = z
  .object({
    id: z.number().int().openapi({ example: 1 }),
    sector: z.string().openapi({ example: "Oradea North" }),
    recordedAt: z.string().datetime().openapi({
      example: "2026-03-13T20:00:00.000Z"
    }),
    perimeterIndex: z.number().openapi({ example: 58 }),
    incidentCount: z.number().int().openapi({ example: 4 }),
    status: z.enum(["NORMAL", "WATCH", "CRITICAL"]).openapi({
      example: "WATCH"
    })
  })
  .openapi("Event");

const summarySchema = z
  .object({
    averagePerimeterIndex: z.number().openapi({ example: 46.3 }),
    peakSector: z.string().openapi({ example: "Cluj Hub" }),
    peakPerimeterIndex: z.number().openapi({ example: 82 }),
    eventCount: z.number().int().openapi({ example: 6 })
  })
  .openapi("Summary");

const healthResponseSchema = z
  .object({
    status: z.literal("ok").openapi({ example: "ok" }),
    service: z.string().openapi({ example: "gdgocode-cloud-track-backend" }),
    databaseTime: z.string().datetime().openapi({
      example: "2026-03-11T10:00:00.000Z"
    })
  })
  .openapi("HealthResponse");

const eventsResponseSchema = z
  .object({
    events: z.array(eventSchema),
    summary: summarySchema,
    readOnly: z.boolean().openapi({ example: true })
  })
  .openapi("EventsResponse");

const readOnlyErrorSchema = z
  .object({
    error: z.string().openapi({
      example:
        "Backend is in read-only mode. Loading and clearing event data are disabled."
    })
  })
  .openapi("ReadOnlyError");

const notFoundSchema = z
  .object({
    error: z.string().openapi({ example: "Route not found" }),
    requestId: z.string().uuid().openapi({
      example: "49ecaf99-4171-493b-9d58-010cb2649244"
    })
  })
  .openapi("NotFoundError");

const seedResponseSchema = z
  .object({
    inserted: z.number().int().openapi({ example: 6 })
  })
  .openapi("SeedEventsResponse");

registry.registerPath({
  method: "get",
  path: "/api/health",
  tags: ["Health"],
  summary: "Check API and database health",
  responses: {
    200: {
      description: "API is healthy",
      content: {
        "application/json": {
          schema: healthResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: "get",
  path: "/api/events",
  tags: ["Events"],
  summary: "List perimeter events and operational summary data",
  responses: {
    200: {
      description: "Perimeter events returned successfully",
      content: {
        "application/json": {
          schema: eventsResponseSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: "post",
  path: "/api/events/seed",
  tags: ["Events"],
  summary: "Seed the perimeter scenario event dataset",
  responses: {
    201: {
      description: "Scenario events inserted successfully",
      content: {
        "application/json": {
          schema: seedResponseSchema
        }
      }
    },
    403: {
      description: "Backend is in read-only mode",
      content: {
        "application/json": {
          schema: readOnlyErrorSchema
        }
      }
    }
  }
});

registry.registerPath({
  method: "delete",
  path: "/api/events",
  tags: ["Events"],
  summary: "Clear all perimeter events",
  responses: {
    204: {
      description: "Perimeter events cleared successfully"
    },
    403: {
      description: "Backend is in read-only mode",
      content: {
        "application/json": {
          schema: readOnlyErrorSchema
        }
      }
    }
  }
});

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: "3.0.3",
  info: {
    title: "GDGoCode Cloud Track API",
    version: "1.0.0",
    description:
      "Public workshop API for the GDGoCode Cloud Track perimeter defense starter."
  },
  servers: [
    {
      url: "/",
      description: "Current environment"
    }
  ],
  tags: [
    { name: "Health", description: "Service and database health" },
    { name: "Events", description: "Perimeter event data and seed flow" }
  ]
});

void notFoundSchema;
