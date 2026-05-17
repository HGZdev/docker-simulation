import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { ordersRouter } from "./features/orders/routes.js";
import { healthRouter } from "./features/health/routes.js";

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Orders API",
      version: "0.1.0"
    },
    servers: [{ url: env.swaggerServerUrl }]
  },
  apis: []
});

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(ordersRouter);
  app.use(healthRouter);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  return app;
};
