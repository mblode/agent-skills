import type { LimitCheck } from "./agents.ts";
import { PLAN_LIMITS, type PlanName } from "./limits.ts";

export function canAttach(plan: PlanName, usedBytes: number, sizeBytes: number): LimitCheck {
  const limit = PLAN_LIMITS[plan].storageBytes;
  if (usedBytes + sizeBytes > limit) {
    return { allowed: false, reason: `This file would take the workspace over its ${plan} plan storage.` };
  }
  return { allowed: true };
}
