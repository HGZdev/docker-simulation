import { test, expect } from "@playwright/test";

test("health placeholder", async ({ request }) => {
  const response = await request.get("/health");
  expect(response.ok()).toBeTruthy();
});
