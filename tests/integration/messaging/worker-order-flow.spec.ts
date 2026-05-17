import { describe, expect, it, vi } from "vitest";

const { consumeMock, updateMock, findFirstMock } = vi.hoisted(() => ({
  consumeMock: vi.fn(async (_topic: string, handler: (message: unknown) => Promise<void>) => handler({})),
  updateMock: vi.fn().mockResolvedValue({ id: "o-1", status: "paid", items: [] }),
  findFirstMock: vi.fn().mockResolvedValue({ id: "o-1", status: "new" })
}));

vi.mock("@docker-simulation/kafka", () => ({
  consume: consumeMock
}));

vi.mock("@docker-simulation/db", () => ({
  prisma: {
    order: {
      findFirst: findFirstMock,
      update: updateMock
    }
  }
}));

import { startConsumer } from "../../../services/worker/src/features/order-processing/consumer.js";

describe("worker order flow integration", () => {
  it("consumes an event and updates the latest order", async () => {
    await startConsumer();

    expect(consumeMock).toHaveBeenCalled();
    expect(findFirstMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalledWith({
      where: { id: "o-1" },
      data: { status: "paid" },
      include: { items: true }
    });
  });
});
