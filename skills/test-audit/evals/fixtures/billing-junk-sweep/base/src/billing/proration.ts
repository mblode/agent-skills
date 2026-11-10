import { PLAN_PRICES, type PlanId } from "./plans.ts";

export interface Period {
  daysInPeriod: number;
  daysRemaining: number;
}

export function prorateUpgrade(from: PlanId, to: PlanId, period: Period): number {
  const difference = PLAN_PRICES[to] - PLAN_PRICES[from];
  if (difference <= 0 || period.daysRemaining <= 0) {
    return 0;
  }
  return Math.round((difference * period.daysRemaining) / period.daysInPeriod);
}

export function creditForDowngrade(from: PlanId, to: PlanId, period: Period): number {
  const difference = PLAN_PRICES[from] - PLAN_PRICES[to];
  if (difference <= 0 || period.daysRemaining <= 0) {
    return 0;
  }
  return Math.floor((difference * period.daysRemaining) / period.daysInPeriod);
}
