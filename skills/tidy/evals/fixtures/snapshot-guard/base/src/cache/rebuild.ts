import { loadEntries } from "../source/load";
import type { Snapshot } from "./types";
import { saveSnapshot } from "./write";

export async function rebuild(key: string): Promise<Snapshot> {
  const entries = await loadEntries(key);
  await saveSnapshot(key, entries);
  return { entries, builtAt: Date.now() };
}
