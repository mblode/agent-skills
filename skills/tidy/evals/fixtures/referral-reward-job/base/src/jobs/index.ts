import type { JobHandler } from "../queue/types.ts";
import { awardPurchase } from "./award-purchase.ts";

export const handlers: Record<string, JobHandler> = {
  "purchase.settled": awardPurchase,
};
