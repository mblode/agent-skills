import { pruneExpired } from "./prune";

const PRUNE_INTERVAL_MS = 60_000;

export function startWorkers(): NodeJS.Timeout {
  return setInterval(() => {
    pruneExpired().catch((error) => console.error("prune failed", error));
  }, PRUNE_INTERVAL_MS);
}
