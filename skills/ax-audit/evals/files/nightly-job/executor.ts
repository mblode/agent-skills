import { requestApproval } from "./approvals";
import { auditLog } from "./audit";
import { tools } from "./tools";
import type { ToolCall, ToolResult } from "./types";

const DESTRUCTIVE = new Set(["archive_deal", "delete_note", "merge_contacts"]);

export interface ExecutionContext {
  workspaceId: string;
  userId: string | null;
  approval: "interactive" | "skip";
}

export async function executeTool(
  call: ToolCall,
  ctx: ExecutionContext,
): Promise<ToolResult> {
  const tool = tools[call.name];
  if (!tool) {
    return { ok: false, error: { code: "UNKNOWN_TOOL", tool: call.name } };
  }

  if (ctx.approval === "interactive" && DESTRUCTIVE.has(call.name)) {
    const decision = await requestApproval(ctx.userId, {
      callId: call.id,
      toolName: call.name,
      input: call.input,
    });
    if (decision !== "approved") {
      return { ok: false, error: { code: "DENIED_BY_USER", tool: call.name } };
    }
  }

  const result = await tool.execute(call.input, { workspaceId: ctx.workspaceId });
  await auditLog.insert({
    workspaceId: ctx.workspaceId,
    tool: call.name,
    input: call.input,
    ok: result.ok,
    at: new Date(),
  });
  return result;
}
