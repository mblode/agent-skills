import type { Plan } from "../users/types";

export const NOTE_LIMITS: Record<Plan, number> = {
  free: 50,
  team: 5000,
};
