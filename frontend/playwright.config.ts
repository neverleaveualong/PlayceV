import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  retries: 1,
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
