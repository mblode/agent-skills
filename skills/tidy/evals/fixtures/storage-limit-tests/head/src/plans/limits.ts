export type PlanName = "starter" | "pro" | "scale";

export interface PlanLimits {
  agents: number;
  storageBytes: number;
}

const GB = 1024 ** 3;

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  starter: { agents: 3, storageBytes: 5 * GB },
  pro: { agents: 25, storageBytes: 50 * GB },
  scale: { agents: 250, storageBytes: 500 * GB },
};
