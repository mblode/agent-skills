import { log } from "../lib/log";
import { archiveRevisions } from "../store/archive";
import { holdWrites, listDocuments, releaseWrites, type DocumentRecord } from "../store/documents";

const KEEP_LATEST = 20;
const HOLD_MS = 1500;

async function compact(doc: DocumentRecord): Promise<void> {
  const ordered = [...doc.revisions.values()].sort((a, b) => a.createdAt - b.createdAt);
  const stale = ordered.slice(0, Math.max(0, ordered.length - KEEP_LATEST));
  if (stale.length === 0) return;

  holdWrites(doc.id, Date.now() + HOLD_MS);
  try {
    await archiveRevisions(doc.id, stale);
    for (const revision of stale) doc.revisions.delete(revision.id);
    log.info("compacted document", { docId: doc.id, archived: stale.length });
  } finally {
    releaseWrites(doc.id);
  }
}

export async function compactDocuments(): Promise<void> {
  for (const doc of listDocuments()) {
    await compact(doc);
  }
}
