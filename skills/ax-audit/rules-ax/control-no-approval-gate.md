---
title: Autonomous agent action without stakes-appropriate approval
slug: control-no-approval-gate
category: control
defaultTier: release-blocker
surfaces: agent-tool-execution
ax-pattern: Escape Hatch (pre-execution dimension)
detection: hybrid
related: control-no-escape-hatch, trust-no-escalation-path, comm-no-approval-gate, control-thin-approval-payload
---

## Autonomous agent action without stakes-appropriate approval

Agent sends an email, posts to Slack, or deletes data without asking. Or it asks confirmation for every trivial action. Either extreme breaks trust. The approval model must match the stakes and reversibility of the action.

## What goes wrong

Scenario A: User says "clean up my calendar." Agent deletes meetings including one with the VP. No confirmation. Scenario B: Agent asks "Move report.pdf? [Yes/No]" for 40 files. User gives up at file 12. Both are approval mismatches.

## Detection

**Surfaces:** agent-tool-execution

**Auditability:** hybrid

**Static signals:**
1. Find agent-initiated side effects (send, delete, create, publish).
2. Classify by stakes and reversibility. Check whether approval precedes high-stakes actions.
3. Flag mismatches in both directions.
4. Where a framework holds the policy, read it. AI SDK 7 `toolApproval` maps each tool to `'not-applicable'`, `'approved'`, `'denied'`, or `'user-approval'`, or runs a function: a catch-all returning `'approved'` is Scenario A, `'user-approval'` on read-only tools is Scenario B. In Claude Agent SDK code, `permissionMode: "bypassPermissions"` in a user-facing product is Scenario A.
5. Where MCP elicitation carries the confirmation, check that three answers mean three outcomes: `decline` and `cancel` both mean do not proceed; only `accept` does.

**Concrete commands:**
```bash
rg -l 'sendEmail|sendMessage|deleteAccount|publishPost|processPayment' --type=ts src/
rg -B 10 'sendEmail|delete|publish' --type=ts src/ | rg 'confirm|approval|modal'
rg -n "toolApproval|'user-approval'|needsApproval|permissionMode|elicitation/create" --type=ts src/
```

**Judgment signals:**
- "User-requested" vs. "agent-initiated" matters. "Clean up my inbox" per-email = user-requested. Agent proactively acting = agent-initiated.
- A single "Are you sure?" for 50 actions is insufficient.
- Stakes and reversibility alone treat every delete the same. If the gate cannot tell a draft the agent created this turn from a record that predates the session, or an internal target from one that leaves the workspace, it can only be tuned by getting stricter. That is a fail: pass provenance in with the stakes.

**False-positive guards:**
- Skip `// ax-audit-ignore:control-no-approval-gate`, test, and Storybook files.

## Fix

Implement the stakes x reversibility matrix. Low/easy: auto-apply. Low/hard: quick confirm. High/easy: show diff. High/hard: explicit modal approval.

```ts
// before: one policy for everything
toolApproval: () => "approved",

// after: the treatment follows stakes, reversibility, and provenance
toolApproval: ({ toolCall }) => {
  const t = tools[toolCall.toolName];
  if (t.readOnly) return "not-applicable";
  if (t.reversible && !leavesWorkspace(toolCall.input)) return "approved"; // receipt with undo
  return "user-approval";                                                   // diff or modal
},
```

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent config | fix-this-sprint |
| Agent dashboard | fix-this-sprint |

## Examples

**Anti-pattern (fails):**

```tsx
async function handleSendEmail(draft: EmailDraft) {
  await emailClient.send(draft);
  return { status: "sent", message: `Email sent to ${draft.to}` };
}
```

**Applied (passes):**

```tsx
async function handleSendEmail(draft: EmailDraft, ctx: AgentContext) {
  const approved = await ctx.modalApproval({
    title: `Send email to ${draft.to}?`,
    preview: <EmailPreview draft={draft} />,
    actions: ["Send", "Edit", "Cancel"],
  });
  if (!approved) return { status: "cancelled" };
  await emailClient.send(draft);
  return { status: "sent" };
}
```

## Suppression

```tsx
{/* ax-audit-ignore:control-no-approval-gate, user opted into auto-apply mode */}
<AutoApplyToggle enabled={userPreference.autoApply} />
```
