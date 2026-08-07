import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://127.0.0.1:${PORT}`;

/*
 * Some environments (CI images, sandboxes) ship a pre-installed browser and
 * disallow `playwright install`. Point PLAYWRIGHT_CHROMIUM_EXECUTABLE at that
 * binary to reuse it. Left unset, Playwright uses its own managed download.
 */
const chromiumExecutable = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const chromeUse = {
  ...devices["Desktop Chrome"],
  ...(chromiumExecutable
    ? { launchOptions: { executablePath: chromiumExecutable } }
    : {}),
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // The specs share one dev server backed by a single in-memory store, so they
  // are only safe run serially: two workers racing on the same account and
  // progress state produce spurious failures. Pin one worker everywhere, not
  // just under CI, so a local run — including `scripts/day.sh ship`, which now
  // runs e2e by default — is as deterministic as CI's.
  workers: 1,
  reporter: process.env.CI ? "list" : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    // Signs in once and saves the session; the gated specs depend on it.
    { name: "setup", testMatch: /.*\.setup\.ts/, use: chromeUse },
    {
      name: "chromium",
      dependencies: ["setup"],
      // No storageState here: specs are unauthenticated by default (marketing,
      // health, shell, and the auth spec itself). The specs behind the gate opt
      // in per file with `test.use({ storageState })`.
      use: chromeUse,
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
