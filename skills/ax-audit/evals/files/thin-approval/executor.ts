import { requestApproval } from "./approvals";
import { auditLog } from "./audit";
import type { Session, ToolCall, ToolResult } from "./types";

export interface ToolInputs {
  search_tickets: { query: string; status?: "open" | "pending" | "closed" };
  draft_reply: { ticketId: string; tone: "neutral" | "apologetic" };
  send_email: { to: string; subject: string; body: string };
  issue_credit: { customerId: string; amountCents: number; reason: string };
  close_ticket: { ticketId: string; resolution: string };
}

const NEEDS_APPROVAL = new Set<keyof ToolInputs>([
  "send_email",
  "issue_credit",
  "close_ticket",
]);

export async function executeToolCall(
  call: ToolCall,
  session: Session,
): Promise<ToolResult> {
  const tool = session.tools[call.name];
  if (!tool) {
    return { ok: false, error: { code: "UNKNOWN_TOOL", tool: call.name } };
  }

  if (NEEDS_APPROVAL.has(call.name)) {
    const decision = await requestApproval(session.userId, {
      callId: call.id,
      toolName: call.name,
    });
    if (decision !== "approved") {
      await auditLog.write({ callId: call.id, outcome: "denied" });
      return { ok: false, error: { code: "DENIED_BY_USER", tool: call.name } };
    }
  }

  const result = await tool.execute(call.input, {
    signal: session.abortSignal,
    userId: session.userId,
  });
  await auditLog.write({ callId: call.id, outcome: result.ok ? "done" : "failed" });
  return result;
}
