import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { channel: "chromium" } }],
  webServer: {
    command: "npm run dev",
    port: 5173,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
