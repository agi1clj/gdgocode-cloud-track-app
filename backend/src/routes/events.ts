import { Router } from "express";
import {
  clearEvents,
  isBackendReadOnly,
  listEvents,
  seedEvents
} from "../services/events.js";

export const eventsRouter = Router();

function readOnlyError() {
  return {
    error:
      "Backend is in read-only mode. Loading and clearing event data are disabled."
  };
}

eventsRouter.get("/", async (_request, response) => {
  response.json(await listEvents());
});
eventsRouter.post("/seed", async (_request, response) => {
  if (isBackendReadOnly()) {
    response.status(403).json(readOnlyError());
    return;
  }

  response.status(201).json(await seedEvents());
});
eventsRouter.delete("/", async (_request, response) => {
  if (isBackendReadOnly()) {
    response.status(403).json(readOnlyError());
    return;
  }

  await clearEvents();
  response.status(204).send();
});
