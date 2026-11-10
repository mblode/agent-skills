import { store } from "./store";
import type { Entry } from "./types";

export async function saveSnapshot(key: string, entries: Entry[]): Promise<void> {
  if (entries.length === 0) {
    return;
  }
  await store.put(key, { entries, builtAt: Date.now() });
}
