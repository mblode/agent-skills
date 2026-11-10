import { expect, test } from "@playwright/test";

const STEPS = [
  { name: "basket", path: "/checkout/basket" },
  { name: "delivery", path: "/checkout/delivery" },
  { name: "payment", path: "/checkout/payment" },
  { name: "confirmation", path: "/checkout/confirmation?order=demo" },
];

for (const step of STEPS) {
  test(`checkout ${step.name} matches its baseline`, async ({ page }) => {
    await page.goto(step.path);
    await page.waitForFunction(() => document.fonts.status === "loaded");
    await expect(page).toHaveScreenshot(`${step.name}.png`, { fullPage: true, maxDiffPixelRatio: 0.002 });
  });
}
