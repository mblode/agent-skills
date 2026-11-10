export type PlanName = "starter" | "pro" | "scale";

export interface PlanLimits {
  agents: number;
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  starter: { agents: 3 },
  pro: { agents: 25 },
  scale: { agents: 250 },
};
