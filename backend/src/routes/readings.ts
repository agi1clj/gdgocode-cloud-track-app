import { Router } from "express";
import {
  clearReadings,
  isBackendReadOnly,
  listReadings,
  seedReadings
} from "../services/readings.js";

export const readingsRouter = Router();

function readOnlyError() {
  return {
    error:
      "Backend is in read-only mode. Loading and clearing sample data are disabled."
  };
}

readingsRouter.get("/", async (_request, response) => {
  response.json(await listReadings());
});
readingsRouter.post("/seed", async (_request, response) => {
  if (isBackendReadOnly()) {
    response.status(403).json(readOnlyError());
    return;
  }

  response.status(201).json(await seedReadings());
});
readingsRouter.delete("/", async (_request, response) => {
  if (isBackendReadOnly()) {
    response.status(403).json(readOnlyError());
    return;
  }

  await clearReadings();
  response.status(204).send();
});
