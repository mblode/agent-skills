# Ship Readiness: Three-Tier Verdict for Agentic Surfaces

Every finding gets exactly one of three tiers. The tier determines whether the PR can ship, must wait, or merges with follow-up.

## Table of contents

- [The three tiers](#the-three-tiers)
- [Tier assignment rules](#tier-assignment-rules)
- [Verdict logic](#verdict-logic)
- [Anti-patterns](#anti-patterns)
- [Examples](#examples)
- [Cross-reference](#cross-reference)

## The three tiers

### ⛔ release-blocker: fix before merge

Findings in this tier must be fixed before the PR is merged. They cause user harm, unsafe autonomous behavior, or unrecoverable agent actions in production.

Tier triggers:
- **No escape hatch**: agent takes actions user cannot interrupt, undo, or override; user is locked into an autonomous workflow with no way out
- **No approval gate on high-stakes actions**: agent autonomously performs destructive, financial, or external actions (deleting records, sending emails, charging cards) without confirmation
- **No escalation path**: agent handles high-stakes decisions with no way to hand off to a human; failures cascade without intervention
- **Silent execution**: agent runs a multi-step task with no progress indication; user cannot tell if it is working, stalled, or failed
- **Heuristic completion**: agent completion detected by idle time rather than an explicit signal; creates race conditions where downstream steps fire too early or too late
- **Broken tool parity**: user can do something the agent cannot, or vice versa; breaks the mental model of what the agent is capable of
- **Missing CRUD**: entity has create but no delete, or read but no update; agent gets stuck mid-workflow with no way to correct or clean up

### ⚠️ fix-this-sprint: merge but log issue

Findings in this tier degrade the agentic experience but don't block shipping. They must have a tracking issue created before merge; the issue should be resolved within the current sprint.

Tier triggers:
- Agent output with no confidence cues or reasoning (functional but trust-eroding)
- No intent handshake before non-trivial actions (functional but risky, agent acts without confirming it understood the request)
- Chat-only interface for button-worthy actions (inefficient; common tasks buried in free-text input)
- Agent uses context but user cannot see or edit what is remembered (opaque but not dangerous)
- System prompt missing resource injection (agent works but is under-informed for the task)
- Config tools bundled instead of atomic (works but inflexible; user cannot grant fine-grained permissions)

### 📋 backlog: track, ship

Findings in this tier are real but low-stakes. Ship the PR, log a backlog issue, prioritize by frequency or impact later.

Tier triggers:
- Interface does not reshape with agent task progression (static but functional)
- Agent does not leverage all available context (underperforms but does not break)
- No generative momentum on blank-canvas surfaces (missed opportunity for proactive suggestions)
- Static API mapping instead of dynamic discovery (works but less flexible when tools change)
- No checkpoint/resume for long-running tasks (risky on interruption but rare in practice)

## Tier assignment rules

Precedence, highest first, apply exactly one:

1. **The rule's own surface-override table** (in the rule file). Most rules carry one; it is authoritative.
2. **The generic surface adjustment below**: only for rules with no override row for the surface in question.
3. **The rule's `defaultTier`.**

Never stack adjustments: a rule whose table already says `release-blocker` on tool execution does not get bumped again.

| Surface context | Generic adjustment |
|---|---|
| Agent tool execution / action panel | Bump 1 tier (sprint → blocker; backlog → sprint): autonomous actions demand higher safety |
| Agent chat / copilot | Same: conversational surfaces tolerate slightly more friction |
| Agent config / system prompt editor | Same |
| Agent dashboard / status | Down 1 tier (blocker → sprint; sprint → backlog): monitoring surfaces are less critical than action surfaces |

## Verdict logic

Aggregate the per-finding tiers into a top-level verdict:

| Verdict | Condition |
|---|---|
| ✅ READY | 0 release-blockers AND ≤3 fix-this-sprint |
| ⚠️ READY WITH FOLLOW-UP | 0 release-blockers AND ≥4 fix-this-sprint |
| ❌ NOT READY | ≥1 release-blocker |
| 🚫 INCOMPLETE | Audit-self-check failed; re-run |

Verdict shows in the summary block at the top of every audit report.

## Anti-patterns

- ❌ **Tier inflation**: assigning every finding `release-blocker`. Kills signal. Reserve the tier for genuine ship-blockers.
- ❌ **Tier deflation**: moving everything to `backlog` to make a verdict look greener. Catches up at the next production incident.
- ❌ **Tier per rule, not per finding**: a rule's default tier is a starting point. Surface context can bump it up or down.
- ❌ **Skipping the override step**, every finding's tier is justified in the audit output: "release-blocker because agent action panel." Don't render bare tiers without context.

## Examples

```json
{
  "rule": "control-no-approval-gate",
  "surface": "AgentActionPanel",
  "defaultTier": "release-blocker",
  "assignedTier": "release-blocker",
  "tierReason": "Rule's own override table: release-blocker on agent tool execution. Agent deletes user records without a confirmation dialog, a high-stakes action with no approval gate."
}
```

```json
{
  "rule": "context-memory-not-visible",
  "surface": "AgentStatusDashboard",
  "defaultTier": "fix-this-sprint",
  "assignedTier": "backlog",
  "tierReason": "Rule's own override table: backlog on agent dashboard. Opaque memory is less critical on a read-only monitoring surface."
}
```

## Cross-reference

For traditional UX findings on agentic surfaces (form data loss, focus management, loading states), run `ux-audit` alongside `ax-audit`. The two skills are complementary: `ax-audit` covers agent-specific safety and interaction patterns while `ux-audit` covers general frontend quality.
