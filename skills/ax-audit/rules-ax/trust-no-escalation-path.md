---
title: High-stakes agent action with no human escalation
slug: trust-no-escalation-path
category: trust
defaultTier: release-blocker
surfaces: agent-tool-execution, agent-chat
ax-pattern: Escape Hatch (escalation dimension)
detection: code-auditable
related: control-no-approval-gate, control-no-escape-hatch
---

## High-stakes agent action with no human escalation

Agent handles a refund request, medical question, or legal inquiry with no way to hand off to a human. It either gives a dangerous answer or refuses entirely. An escalation path is the trust floor.

## What goes wrong

User asks about a billing dispute. Agent applies a partial credit that doesn't match. No "talk to a person" button. Agent keeps trying, making things worse. User files a chargeback.

## Detection

**Surfaces:** agent-tool-execution, agent-chat

**Auditability:** code-auditable

**Static signals:**
1. Find action handlers for high-stakes operations (financial, medical, legal, account deletion).
2. Check for escalation/handoff logic. Flag high-stakes handlers with no escalation path.

**Concrete commands:**
```bash
rg -l 'refund|payment|delete.*account|send.*email|legal|medical' --type=ts src/
rg 'escalat|handoff|transfer.*human|transfer.*agent' --type=ts src/
```

**Judgment signals:**
- An escalation tool never referenced in the system prompt is effectively invisible.

**False-positive guards:**
- Skip `// ax-audit-ignore:trust-no-escalation-path`, test, and Storybook files.

## Fix

Add `escalate_to_human(reason, context)` as an agent tool. Surface it in the UI as "Talk to a person."

## Examples

**Anti-pattern (fails):**

```tsx
const agentTools = {
  processRefund: async (amount: number) => {
    await api.refund(amount);
    return { success: true, message: "Refund processed." };
  },
};
```

**Applied (passes):**

```tsx
const agentTools = {
  processRefund: async (amount: number) => {
    if (amount > ESCALATION_THRESHOLD) return { escalate: true, reason: "Exceeds limit" };
    await api.refund(amount);
    return { success: true };
  },
  escalateToHuman: async (reason: string, ctx: AgentContext) => {
    await support.transfer({ reason, transcript: ctx.messages });
    return { message: "Connecting you with a team member." };
  },
};
```

## Default tier and overrides

**Defaults to:** `release-blocker`

| Surface | Tier |
|---|---|
| Agent tool execution | release-blocker |
| Agent chat | release-blocker |
| Agent config | backlog |
| Agent dashboard | fix-this-sprint |

## Suppression

```tsx
{/* ax-audit-ignore:trust-no-escalation-path, internal admin tool, operator is the human */}
<AgentToolPanel tools={adminTools} />
```
