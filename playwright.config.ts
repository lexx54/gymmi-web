import { defineConfig, devices } from '@playwright/test';

const port = 5173;
const baseURL = `http://127.0.0.1:${port}`;

// Dedicated e2e API (gymmi_e2e on port 3001). Never the dev API on :3000.
const apiURL = process.env.E2E_API_URL ?? 'http://localhost:3001';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Auth endpoints are throttled per X-Client-Id; keep local runs modestly parallel.
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      // Own the API on gymmi_e2e; do not reuse the developer start:dev on :3000.
      command: 'npm run start:e2e',
      cwd: '../gymmi-api',
      url: apiURL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ENV_FILE: '.env.e2e',
      },
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_API_URL: apiURL,
      },
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
