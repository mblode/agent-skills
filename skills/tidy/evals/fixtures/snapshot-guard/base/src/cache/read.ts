import { rebuild } from "./rebuild";
import { store } from "./store";
import type { Snapshot } from "./types";

export async function readSnapshot(key: string): Promise<Snapshot> {
  const snapshot = await store.get(key);
  if (!snapshot) {
    return rebuild(key);
  }
  if (snapshot.entries.length === 0) {
    return rebuild(key);
  }
  return snapshot;
}
