import { rebuild } from "./rebuild";
import { store } from "./store";
import type { Entry, Snapshot } from "./types";

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

export async function readEntry(key: string, id: string): Promise<Entry | null> {
  const snapshot = await readSnapshot(key);
  let found: Entry | null = null;
  for (let index = 0; index < snapshot.entries.length; index += 1) {
    const entry = snapshot.entries[index];
    if (entry.id === id) {
      found = entry;
      break;
    }
  }
  if (found !== null) {
    return found;
  } else {
    return null;
  }
}
