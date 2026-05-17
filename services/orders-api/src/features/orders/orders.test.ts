import { describe, expect, it, vi } from "vitest";

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    order: {
      create: vi.fn().mockResolvedValue({ id: "o-1", status: "new", items: [{ productId: "p-1", quantity: 1 }] })
    }
  }
}));

import { createOrder } from "./service.js";

describe("orders service", () => {
  it("creates a new order", async () => {
    const order = await createOrder([{ productId: "p-1", quantity: 1 }]);
    expect(order.status).toBe("new");
  });
});
