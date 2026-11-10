import type { PlanName } from "../plans/limits.ts";

export interface Workspace {
  id: string;
  plan: PlanName;
  attachmentBytesUsed: number;
}

export interface Attachment {
  id: string;
  ticketId: string;
  name: string;
  sizeBytes: number;
}
