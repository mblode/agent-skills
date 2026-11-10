import type { Revision } from "./documents";

const ARCHIVE_URL = process.env.ARCHIVE_URL ?? "http://localhost:9400";

export async function archiveRevisions(docId: string, revisions: Revision[]): Promise<void> {
  const response = await fetch(`${ARCHIVE_URL}/documents/${docId}/revisions`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(revisions),
  });
  if (!response.ok) {
    throw new Error(`archive rejected ${revisions.length} revisions for ${docId}: ${response.status}`);
  }
}
