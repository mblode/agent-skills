import { store } from "./store";
import type { Entry } from "./types";

export async function saveSnapshot(key: string, entries: Entry[]): Promise<void> {
  await store.put(key, { entries, builtAt: Date.now() });
}
