import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { orderCreateMock, orderFindManyMock, publishMock } = vi.hoisted(() => ({
  orderCreateMock: vi.fn(),
  orderFindManyMock: vi.fn(),
  publishMock: vi.fn()
}));

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    order: {
      create: orderCreateMock,
      findMany: orderFindManyMock
    }
  }
}));

vi.mock("@docker-simulation/kafka", () => ({
  topics: { orderCreated: "order.created" },
  publish: publishMock
}));

import { createApp } from "../../../services/orders-api/src/app.js";

describe("orders api integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    publishMock.mockResolvedValue(undefined);
  });

  it("creates an order through HTTP and publishes an event", async () => {
    orderCreateMock.mockResolvedValue({
      id: "o-1",
      status: "new",
      items: [{ id: "oi-1", productId: "p-1", quantity: 2 }]
    });

    const response = await request(createApp())
      .post("/orders")
      .send({ items: [{ productId: "p-1", quantity: 2 }] });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe("o-1");
    expect(orderCreateMock).toHaveBeenCalled();
    expect(publishMock).toHaveBeenCalledWith(
      "order.created",
      expect.objectContaining({ orderId: "o-1" })
    );
  });

  it("returns orders through HTTP", async () => {
    orderFindManyMock.mockResolvedValue([{ id: "o-1", status: "paid", items: [] }]);

    const response = await request(createApp()).get("/orders");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
});
