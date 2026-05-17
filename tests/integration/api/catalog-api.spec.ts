import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { productFindManyMock } = vi.hoisted(() => ({
  productFindManyMock: vi.fn()
}));

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    product: {
      findMany: productFindManyMock
    }
  }
}));

import { createApp } from "../../../services/catalog-api/src/app.js";

describe("catalog api integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns products from the data layer through HTTP", async () => {
    productFindManyMock.mockResolvedValue([
      { id: "p-1", name: "Keyboard", price: 100, stock: 2 },
      { id: "p-2", name: "Monitor", price: 200, stock: 1 }
    ]);

    const response = await request(createApp()).get("/products");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: [
        { id: "p-1", name: "Keyboard", price: 100, stock: 2 },
        { id: "p-2", name: "Monitor", price: 200, stock: 1 }
      ]
    });
  });
});
