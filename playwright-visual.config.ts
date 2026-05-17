import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "frontend/src",
  testMatch: /.*\.visual\.spec\.ts$/,
  projects: [
    {
      name: "chrome",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] }
    }
  ]
});
