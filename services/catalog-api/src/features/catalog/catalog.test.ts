import { describe, expect, it, vi } from "vitest";

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    product: {
      findMany: vi.fn().mockResolvedValue([{ id: "p-1", name: "Keyboard", price: 10, stock: 2 }])
    }
  }
}));

import { listProducts } from "./service.js";

describe("catalog service", () => {
  it("returns seeded products", async () => {
    const products = await listProducts();
    expect(products.length).toBeGreaterThan(0);
  });
});
