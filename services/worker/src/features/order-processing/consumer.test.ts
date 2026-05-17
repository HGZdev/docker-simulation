import { describe, expect, it, vi } from "vitest";

const { consumeMock, markLatestOrderAsPaidMock, loggerInfoMock } = vi.hoisted(() => ({
  consumeMock: vi.fn(async (_topic: string, handler: (message: unknown) => Promise<void>) => handler({})),
  markLatestOrderAsPaidMock: vi.fn().mockResolvedValue({ id: "o-1", status: "paid" }),
  loggerInfoMock: vi.fn()
}));

vi.mock("@docker-simulation/kafka", () => ({
  consume: consumeMock
}));

vi.mock("./service.js", () => ({
  markLatestOrderAsPaid: markLatestOrderAsPaidMock
}));

vi.mock("../../lib/logger.js", () => ({
  logger: {
    info: loggerInfoMock
  }
}));

import { startConsumer } from "./consumer.js";

describe("worker consumer", () => {
  it("consumes the configured topic and logs processed order", async () => {
    await startConsumer();

    expect(consumeMock).toHaveBeenCalledWith("order.created", expect.any(Function));
    expect(markLatestOrderAsPaidMock).toHaveBeenCalled();
    expect(loggerInfoMock).toHaveBeenCalledWith("processed order", "o-1");
  });
});
