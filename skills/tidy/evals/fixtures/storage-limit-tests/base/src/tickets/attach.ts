import { randomUUID } from "node:crypto";
import type { Attachment, Workspace } from "./types.ts";

export interface AttachResult {
  attachment?: Attachment;
  error?: string;
}

export function attachToTicket(workspace: Workspace, ticketId: string, name: string, sizeBytes: number): AttachResult {
  if (sizeBytes <= 0) {
    return { error: "The file is empty." };
  }
  workspace.attachmentBytesUsed += sizeBytes;
  return { attachment: { id: randomUUID(), ticketId, name, sizeBytes } };
}
