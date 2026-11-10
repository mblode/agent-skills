export type Plan = "free" | "team";

export interface User {
  id: string;
  email: string;
  plan: string;
}
