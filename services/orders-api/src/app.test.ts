import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMock, listMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
  listMock: vi.fn()
}));

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    order: {
      create: createMock,
      findMany: listMock
    }
  }
}));

vi.mock("@docker-simulation/kafka", () => ({
  topics: { orderCreated: "order.created" },
  publish: vi.fn().mockResolvedValue(undefined)
}));

import { createApp } from "./app.js";

describe("orders app", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns health status", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns orders list", async () => {
    listMock.mockResolvedValue([{ id: "o-1", status: "new", items: [] }]);

    const response = await request(createApp()).get("/orders");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  it("creates an order from valid payload", async () => {
    createMock.mockResolvedValue({ id: "o-1", status: "new", items: [{ productId: "p-1", quantity: 1 }] });

    const response = await request(createApp())
      .post("/orders")
      .send({ items: [{ productId: "p-1", quantity: 1 }] });

    expect(response.status).toBe(201);
    expect(response.body.data.id).toBe("o-1");
  });

  it("rejects invalid order payload", async () => {
    const response = await request(createApp())
      .post("/orders")
      .send({ items: [] });

    expect(response.status).toBe(500);
  });
});
