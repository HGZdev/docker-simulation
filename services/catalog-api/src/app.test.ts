import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findManyMock } = vi.hoisted(() => ({
  findManyMock: vi.fn()
}));

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    product: {
      findMany: findManyMock
    }
  }
}));

import { createApp } from "./app.js";

describe("catalog app", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns health status", async () => {
    const response = await request(createApp()).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("returns products", async () => {
    findManyMock.mockResolvedValue([{ id: "p-1", name: "Keyboard", price: 100, stock: 2 }]);

    const response = await request(createApp()).get("/products");

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });
});
