import { describe, expect, it, vi } from "vitest";

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    order: {
      findFirst: vi.fn().mockResolvedValue({ id: "o-1", status: "new" }),
      update: vi.fn().mockResolvedValue({ id: "o-1", status: "paid", items: [] })
    }
  }
}));

import { markLatestOrderAsPaid } from "./service.js";

describe("order processing", () => {
  it("marks latest order as paid", async () => {
    const order = await markLatestOrderAsPaid();
    expect(order?.status).toBe("paid");
  });
});
