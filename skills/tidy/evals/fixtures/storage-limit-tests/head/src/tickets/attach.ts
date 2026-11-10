import { randomUUID } from "node:crypto";
import { canAttach } from "../plans/attachments.ts";
import type { Attachment, Workspace } from "./types.ts";

export interface AttachResult {
  attachment?: Attachment;
  error?: string;
}

export function attachToTicket(workspace: Workspace, ticketId: string, name: string, sizeBytes: number): AttachResult {
  if (sizeBytes <= 0) {
    return { error: "The file is empty." };
  }
  const check = canAttach(workspace.plan, workspace.attachmentBytesUsed, sizeBytes);
  if (!check.allowed) {
    return { error: check.reason };
  }
  workspace.attachmentBytesUsed += sizeBytes;
  return { attachment: { id: randomUUID(), ticketId, name, sizeBytes } };
}
