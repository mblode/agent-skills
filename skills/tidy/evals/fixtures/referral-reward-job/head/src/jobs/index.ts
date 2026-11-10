import type { JobHandler } from "../queue/types.ts";
import { awardPurchase } from "./award-purchase.ts";
import { awardReferral } from "./award-referral.ts";

export const handlers: Record<string, JobHandler> = {
  "purchase.settled": awardPurchase,
  "referral.completed": awardReferral,
};
