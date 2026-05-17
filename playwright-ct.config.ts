import { defineConfig } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "frontend/src",
  testMatch: /.*\.ct\.tsx$/,
  use: {
    ctPort: 3100
  }
});
