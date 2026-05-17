import express from "express";
import { catalogRouter } from "./features/catalog/routes.js";
import { healthRouter } from "./features/health/routes.js";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(catalogRouter);
  app.use(healthRouter);
  return app;
};
