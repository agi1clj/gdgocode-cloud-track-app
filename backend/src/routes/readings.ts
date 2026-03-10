import { Router } from "express";
import {
  clearReadings,
  listReadings,
  seedReadings
} from "../services/readings.js";

export const readingsRouter = Router();
readingsRouter.get("/", async (_request, response) => {
  response.json(await listReadings());
});
readingsRouter.post("/seed", async (_request, response) => {
  response.status(201).json(await seedReadings());
});
readingsRouter.delete("/", async (_request, response) => {
  await clearReadings();
  response.status(204).send();
});
