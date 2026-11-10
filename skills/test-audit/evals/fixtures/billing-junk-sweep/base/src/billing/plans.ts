export type PlanId = "solo" | "team" | "studio";

export const PLAN_PRICES: Record<PlanId, number> = {
  solo: 900,
  team: 2900,
  studio: 7900,
};
