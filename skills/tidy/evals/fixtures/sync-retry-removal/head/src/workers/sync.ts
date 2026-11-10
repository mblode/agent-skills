import { log } from "../lib/log";
import { upsertRevision, type Revision } from "../store/documents";
import type { ChangeQueue, PendingChange } from "./queue";

const BATCH_SIZE = 50;

function toRevision(change: PendingChange): Revision {
  return { id: change.id, docId: change.docId, body: change.body, createdAt: change.editedAt };
}

export async function applyChange(change: PendingChange): Promise<void> {
  upsertRevision(toRevision(change));
}

export async function drain(queue: ChangeQueue): Promise<number> {
  let applied = 0;
  for (const change of queue.take(BATCH_SIZE)) {
    try {
      await applyChange(change);
      queue.ack(change.id);
      applied += 1;
    } catch (error) {
      log.warn("dropping change that could not be written", { changeId: change.id, error: String(error) });
      queue.discard(change.id, String(error));
    }
  }
  return applied;
}
