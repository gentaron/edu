/* ═══════════════════════════════════════════════════════════
   Playwright E2E Configuration
   WebGPU compute pipeline integration tests
   ═══════════════════════════════════════════════════════════ */

import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./src/metal/webgpu/__e2e__",
  testMatch: "**/*.e2e.?(c|m)[jt]?(s|x)?",

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",

  timeout: 30_000,
  expect: {
    timeout: 15_000,
  },

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  outputDir: "test-results",

  projects: [
    {
      name: "chromium-webgpu",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--enable-unsafe-webgpu",
            "--enable-features=Vulkan",
            "--use-angle=vulkan",
            "--disable-gpu-process-crash-limit",
            "--disable-features=AutoDisableWebGPU",
          ],
        },
      },
    },
  ],

  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
