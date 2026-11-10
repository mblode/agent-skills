import type { Entry } from "../cache/types";

const WAREHOUSE_URL = process.env.WAREHOUSE_URL ?? "http://localhost:8123";
const ENTRY_TTL_MS = 10 * 60_000;

export async function loadEntries(key: string): Promise<Entry[]> {
  const response = await fetch(`${WAREHOUSE_URL}/series/${encodeURIComponent(key)}`);
  if (!response.ok) throw new Error(`warehouse returned ${response.status} for ${key}`);
  const rows = (await response.json()) as Array<{ id: string; value: number }>;
  const expiresAt = Date.now() + ENTRY_TTL_MS;
  return rows.map((row) => ({ id: row.id, value: row.value, expiresAt }));
}
