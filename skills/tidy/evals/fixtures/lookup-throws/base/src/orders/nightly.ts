import { readFileSync } from "node:fs";
import { planReorder } from "./reorder.ts";
import type { ReorderPlan } from "./reorder.ts";

const WATCHLIST_PATH = process.env.SUPPLIER_WATCHLIST ?? "data/supplier-watchlist.txt";

export function readWatchlist(path = WATCHLIST_PATH): string[] {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"));
}

export function runNightlyReorder(skus = readWatchlist()): ReorderPlan {
  const plan = planReorder(skus);
  if (plan.skipped.length > 0) {
    console.warn(`reorder skipped ${plan.skipped.length} unknown skus: ${plan.skipped.join(", ")}`);
  }
  console.log(`reorder planned ${plan.lines.length} purchase lines`);
  return plan;
}
