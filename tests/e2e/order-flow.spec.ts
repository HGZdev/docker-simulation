import { test, expect } from "@playwright/test";
import { createServer } from "node:http";
import { once } from "node:events";

process.env.USE_IN_MEMORY_DB = "true";

test.describe("order flow e2e", () => {
  let server: ReturnType<typeof createServer>;
  let prisma: Awaited<typeof import("../../packages/db/src/index.js")>["prisma"];
  let resetTestingState: Awaited<typeof import("../../packages/db/src/index.js")>["resetTestingState"];
  let resetSubscriptions: Awaited<typeof import("../../packages/kafka/src/index.js")>["resetSubscriptions"];
  let startConsumer: Awaited<typeof import("../../services/worker/src/features/order-processing/consumer.js")>["startConsumer"];
  let createApp: Awaited<typeof import("../../services/orders-api/src/app.js")>["createApp"];

  test.beforeEach(async () => {
    ({ prisma, resetTestingState } = await import("../../packages/db/src/index.js"));
    ({ resetSubscriptions } = await import("../../packages/kafka/src/index.js"));
    ({ startConsumer } = await import("../../services/worker/src/features/order-processing/consumer.js"));
    ({ createApp } = await import("../../services/orders-api/src/app.js"));

    resetTestingState();
    resetSubscriptions();
    await startConsumer();

    server = createServer(createApp());
    server.listen(3002);
    await once(server, "listening");
  });

  test.afterEach(async () => {
    server.close();
    await once(server, "close");
  });

  test("creates an order and updates it through the worker", async ({ request }) => {
    const createResponse = await request.post("/orders", {
      data: {
        items: [{ productId: "p-1", quantity: 1 }]
      }
    });

    expect(createResponse.status()).toBe(201);

    const listResponse = await request.get("/orders");
    expect(listResponse.status()).toBe(200);

    const body = await listResponse.json();
    expect(body.data).toHaveLength(1);
    expect(body.data[0].status).toBe("paid");

    const orderFromDb = await prisma.order.findFirst();
    expect(orderFromDb?.status).toBe("paid");
  });
});
