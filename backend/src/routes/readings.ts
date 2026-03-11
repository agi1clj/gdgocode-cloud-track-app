import { Router } from "express";
import {
  clearReadings,
  listReadings,
  seedReadings
} from "../services/readings.js";

export const readingsRouter = Router();

function routeEnabled(value: string | undefined) {
  return value !== "false";
}

readingsRouter.get("/", async (_request, response) => {
  response.json(await listReadings());
});
readingsRouter.post("/seed", async (_request, response) => {
  if (!routeEnabled(process.env.ENABLE_SEED_ENDPOINT)) {
    response.status(404).json({
      error: "Route not found"
    });
    return;
  }

  response.status(201).json(await seedReadings());
});
readingsRouter.delete("/", async (_request, response) => {
  if (!routeEnabled(process.env.ENABLE_CLEAR_ENDPOINT)) {
    response.status(404).json({
      error: "Route not found"
    });
    return;
  }

  await clearReadings();
  response.status(204).send();
});
