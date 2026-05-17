import { Router } from "express";
import { listProducts } from "./service.js";

export const catalogRouter = Router();

catalogRouter.get("/products", async (_req, res) => {
  res.json({ data: await listProducts() });
});
