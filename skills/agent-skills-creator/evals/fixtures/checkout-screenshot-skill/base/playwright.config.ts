import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "visual",
  snapshotPathTemplate: "visual/baselines/{projectName}/{arg}{ext}",
  outputDir: "visual/results",
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
