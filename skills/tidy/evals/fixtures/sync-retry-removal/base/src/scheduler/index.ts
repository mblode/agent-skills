import { log } from "../lib/log";
import { compactDocuments } from "./compaction";

const MINUTE = 60_000;

function every(intervalMs: number, name: string, job: () => Promise<void>): NodeJS.Timeout {
  return setInterval(() => {
    job().catch((error) => log.warn("scheduled job failed", { name, error: String(error) }));
  }, intervalMs);
}

export function startScheduler(): NodeJS.Timeout[] {
  return [every(5 * MINUTE, "compact-documents", compactDocuments)];
}
