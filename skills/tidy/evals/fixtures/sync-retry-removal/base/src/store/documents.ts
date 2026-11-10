export interface Revision {
  id: string;
  docId: string;
  body: string;
  createdAt: number;
}

export interface DocumentRecord {
  id: string;
  revisions: Map<string, Revision>;
  holdUntil: number | null;
}

export class WriteHeldError extends Error {
  readonly docId: string;

  constructor(docId: string, until: number) {
    super(`document ${docId} is not accepting writes until ${new Date(until).toISOString()}`);
    this.name = "WriteHeldError";
    this.docId = docId;
  }
}

const documents = new Map<string, DocumentRecord>();

export function getDocument(id: string): DocumentRecord {
  let doc = documents.get(id);
  if (!doc) {
    doc = { id, revisions: new Map(), holdUntil: null };
    documents.set(id, doc);
  }
  return doc;
}

export function listDocuments(): DocumentRecord[] {
  return [...documents.values()];
}

export function upsertRevision(revision: Revision, now = Date.now()): void {
  const doc = getDocument(revision.docId);
  if (doc.holdUntil !== null && doc.holdUntil > now) {
    throw new WriteHeldError(doc.id, doc.holdUntil);
  }
  doc.revisions.set(revision.id, revision);
}

export function holdWrites(docId: string, until: number): void {
  getDocument(docId).holdUntil = until;
}

export function releaseWrites(docId: string): void {
  getDocument(docId).holdUntil = null;
}
