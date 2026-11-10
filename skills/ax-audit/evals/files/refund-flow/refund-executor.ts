import { z } from "zod";
import { requestApproval } from "./approvals";
import { auditLog } from "./audit";
import { emitProgress } from "./events";
import { payments } from "./payments";
import type { Session, ToolResult } from "./types";

export const issueRefundInput = z.object({
  orderId: z.string(),
  amountCents: z.number().int().positive(),
  reason: z.enum(["damaged", "late", "duplicate_charge", "goodwill"]),
});

export type IssueRefundInput = z.infer<typeof issueRefundInput>;

export async function issueRefund(
  raw: unknown,
  session: Session,
  signal: AbortSignal,
): Promise<ToolResult<{ refundId: string; amountCents: number }>> {
  const parsed = issueRefundInput.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: { code: "INVALID_INPUT", issues: parsed.error.issues } };
  }
  const input = parsed.data;
  const order = await payments.getOrder(input.orderId, { signal });
  if (input.amountCents > order.paidCents - order.refundedCents) {
    return { ok: false, error: { code: "EXCEEDS_REFUNDABLE", orderId: order.id } };
  }

  emitProgress(session, { step: "awaiting_approval", tool: "issue_refund" });
  const decision = await requestApproval(session.userId, {
    tool: "issue_refund",
    input,
    display: {
      customerName: order.customerName,
      orderNumber: order.number,
      amountCents: input.amountCents,
      currency: order.currency,
      reason: input.reason,
      alreadyRefundedCents: order.refundedCents,
    },
    signal,
  });
  if (decision.outcome !== "approved") {
    await auditLog.write({ tool: "issue_refund", input, outcome: decision.outcome });
    return { ok: false, error: { code: "DENIED_BY_USER" } };
  }

  signal.throwIfAborted();
  emitProgress(session, { step: "executing", tool: "issue_refund" });
  const refund = await payments.refund(order.id, input.amountCents, {
    idempotencyKey: decision.approvalId,
    signal,
  });
  await auditLog.write({ tool: "issue_refund", input, outcome: "done", refundId: refund.id });
  emitProgress(session, { step: "done", tool: "issue_refund" });
  return { ok: true, data: { refundId: refund.id, amountCents: refund.amountCents } };
}
