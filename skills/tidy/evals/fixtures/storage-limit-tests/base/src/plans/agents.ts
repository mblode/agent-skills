import { PLAN_LIMITS, type PlanName } from "./limits.ts";

export interface LimitCheck {
  allowed: boolean;
  reason?: string;
}

export function canInviteAgent(plan: PlanName, currentAgents: number, pendingInvites: number): LimitCheck {
  const limit = PLAN_LIMITS[plan].agents;
  if (currentAgents + pendingInvites >= limit) {
    return { allowed: false, reason: `The ${plan} plan includes ${limit} agents.` };
  }
  return { allowed: true };
}
