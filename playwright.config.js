import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Test Configuration for Affilifest Masterclass
 * Multi-resolution validation across 1080p FHD, 4K UHD, and 8K Commercial Wall canvases.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.js/,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    /* 1080p Full HD Display (Standard Venue Projector) */
    {
      name: '1080p-fhd',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },

    /* 4K Ultra HD Display (Commercial 4K Panels) */
    {
      name: '4k-uhd',
      use: {
        browserName: 'chromium',
        viewport: { width: 3840, height: 2160 },
        deviceScaleFactor: 1,
      },
    },

    /* 8K Commercial Video Wall */
    {
      name: '8k-wall',
      use: {
        browserName: 'chromium',
        viewport: { width: 7680, height: 4320 },
        deviceScaleFactor: 1,
      },
    },

    /* Operator Console (notes.html) */
    {
      name: 'notes-console',
      use: {
        browserName: 'chromium',
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
  ],

  /* Run local web server if not already running */
  webServer: {
    command: 'npx vite --port 3000',
    port: 3000,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
