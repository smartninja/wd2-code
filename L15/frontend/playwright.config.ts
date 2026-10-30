import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  reporter: [["list"], ["html", { open: "never" }]], // console + playwright-report/
  use: {
    baseURL: "http://localhost:5173", // your running React app
    trace: "retain-on-failure", // full step-by-step recording, kept only on failure
    screenshot: "only-on-failure", // a snapshot at the moment it failed
    video: "retain-on-failure", // a video of the run, kept only on failure
  },
  retries: process.env.CI ? 2 : 0, // in CI, retry a flaky test before giving up
});
