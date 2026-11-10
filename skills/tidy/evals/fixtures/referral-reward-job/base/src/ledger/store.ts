import { randomUUID } from "node:crypto";

export interface LedgerEntry {
  id: string;
  accountId: string;
  points: number;
  reason: string;
  reference?: string;
  createdAt: string;
}

const entries: LedgerEntry[] = [];

export const ledger = {
  async credit(accountId: string, points: number, reason: string, reference?: string): Promise<LedgerEntry> {
    if (reference) {
      const existing = entries.find((entry) => entry.reference === reference);
      if (existing) return existing;
    }
    const entry: LedgerEntry = {
      id: randomUUID(),
      accountId,
      points,
      reason,
      reference,
      createdAt: new Date().toISOString(),
    };
    entries.push(entry);
    return entry;
  },
  async balance(accountId: string): Promise<number> {
    return entries
      .filter((entry) => entry.accountId === accountId)
      .reduce((total, entry) => total + entry.points, 0);
  },
};
