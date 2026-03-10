import { Router } from "express";
import { getDatabaseTime } from "../services/readings.js";

export const healthRouter = Router();
healthRouter.get("/", async (_request, response) => {
  const databaseTime = await getDatabaseTime();

  response.json({
    status: "ok",
    service: "gdgocode-cloud-track-backend",
    databaseTime
  });
});
