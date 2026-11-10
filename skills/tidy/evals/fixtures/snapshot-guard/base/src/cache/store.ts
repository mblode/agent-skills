import type { Snapshot } from "./types";

const snapshots = new Map<string, Snapshot>();

export const store = {
  async get(key: string): Promise<Snapshot | undefined> {
    return snapshots.get(key);
  },
  async put(key: string, snapshot: Snapshot): Promise<void> {
    snapshots.set(key, snapshot);
  },
  async keys(): Promise<string[]> {
    return [...snapshots.keys()];
  },
};
