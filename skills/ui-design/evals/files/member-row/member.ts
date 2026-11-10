import { z } from "zod";

export const memberSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1).max(120),
  email: z.string().email().max(254),
  avatarUrl: z.string().url().optional(),
  role: z.enum(["owner", "admin", "member", "billing-contact"]),
  teams: z.array(z.string().min(1).max(40)).max(50),
  openTasks: z.number().int().min(0),
  lastActiveAt: z.string().datetime().nullable(),
});

export type Member = z.infer<typeof memberSchema>;

export const demoMembers: Member[] = [
  {
    id: "5b1f6c1e-2f6a-4a51-9a59-0e2a6a0f8a11",
    displayName: "Ana Ruiz",
    email: "ana@fernline.test",
    avatarUrl: "https://cdn.fernline.test/avatars/ana.png",
    role: "owner",
    teams: ["Front desk"],
    openTasks: 4,
    lastActiveAt: "2026-03-02T09:14:00Z",
  },
  {
    id: "0c8d0f0b-8b40-4e58-b4f0-3d5c7a2f9b22",
    displayName: "Tom Okafor",
    email: "tom@fernline.test",
    avatarUrl: "https://cdn.fernline.test/avatars/tom.png",
    role: "member",
    teams: ["Nursing", "Roster"],
    openTasks: 12,
    lastActiveAt: "2026-03-01T17:40:00Z",
  },
];
