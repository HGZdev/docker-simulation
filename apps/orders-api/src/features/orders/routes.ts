import { Router } from "express";
import { createOrderSchema } from "@docker-simulation/shared";
import { createOrder, listOrders } from "./service.js";

export const ordersRouter = Router();

ordersRouter.get("/orders", async (_req, res) => {
  res.json({ data: await listOrders() });
});

ordersRouter.post("/orders", async (req, res) => {
  const payload = createOrderSchema.parse(req.body);
  const order = await createOrder(payload.items);
  res.status(201).json({ data: order });
});
