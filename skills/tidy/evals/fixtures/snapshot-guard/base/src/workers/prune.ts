import { store } from "../cache/store";

export async function pruneExpired(now = Date.now()): Promise<number> {
  let removed = 0;
  for (const key of await store.keys()) {
    const snapshot = await store.get(key);
    if (!snapshot) continue;
    const live = snapshot.entries.filter((entry) => entry.expiresAt > now);
    if (live.length === snapshot.entries.length) continue;
    removed += snapshot.entries.length - live.length;
    await store.put(key, { ...snapshot, entries: live });
  }
  return removed;
}
