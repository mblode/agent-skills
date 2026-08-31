# Ship Readiness: Three-Tier Verdict for Agentic Surfaces

Every finding gets one of three tiers, deciding whether the PR ships, waits, or merges with follow-up.

## Table of contents

- [The three tiers](#the-three-tiers)
- [Tier assignment rules](#tier-assignment-rules)
- [Verdict logic](#verdict-logic)

## The three tiers

### ⛔ release-blocker: fix before merge

Cause user harm, unsafe autonomous behavior, or unrecoverable agent actions in production. Triggers:
- **No escape hatch**: agent takes actions the user cannot interrupt, undo, or override; locked into an autonomous workflow with no way out.
- **No approval gate on high-stakes actions**: agent autonomously runs destructive, financial, or external actions (deleting records, sending emails, charging cards) without confirmation.
- **No escalation path**: high-stakes decisions with no human handoff; failures cascade without intervention.
- **Silent execution**: multi-step task with no progress indication; user cannot tell if it is working, stalled, or failed.
- **Heuristic completion**: completion detected by idle time, not an explicit signal; downstream steps race (fire too early or too late).
- **Broken tool parity**: user can do something the agent cannot, or vice versa; breaks the mental model of what the agent can do.
- **Missing CRUD**: entity has create but no delete, or read but no update; agent gets stuck mid-workflow with no way to correct or clean up.
The next four are blockers on the agent tool execution surface and one tier lower elsewhere, because each is a property of code that acts rather than code that reports:

- **Unconsented proactive execution**: a scheduled, webhook, or queued run reaches the executor missing a standing boundary, a notice the user can act on, or both; the interactive gates do not cover it, because nobody was there to prompt.
- **Undisclosed reach**: the agent acts through accounts and scopes the user cannot see or individually revoke; the one thing watching the agent work will never reveal.
- **Approval with nothing to decide on**: a gate that fires correctly and renders only the tool's name, so the user approves a category rather than an act.
- **Tool output that misreports its own state**: failures returned as prose with a success status; every capability above the tool is guessing, silently.

### ⚠️ fix-this-sprint: merge but log issue

Degrade the agentic experience but don't block shipping. Need a tracking issue before merge, resolved within the current sprint. Triggers:
- Agent output with no confidence cues or reasoning (functional but trust-eroding)
- No intent handshake before non-trivial actions (agent acts without confirming it understood the request)
- Chat-only interface for button-worthy actions (common tasks buried in free-text input)
- Agent uses context but user cannot see or edit what is remembered (opaque but not dangerous)
- System prompt missing resource injection (agent under-informed for the task)
- Config tools bundled instead of atomic (inflexible; user cannot grant fine-grained permissions)

### 📋 backlog: track, ship

Real but low-stakes. Ship the PR, log a backlog issue, prioritize by frequency or impact later. Triggers:
- Interface does not reshape with agent task progression (static but functional)
- Agent does not leverage all available context (underperforms but does not break)
- No generative momentum on blank-canvas surfaces (missed proactive-suggestion opportunity)
- Static API mapping instead of dynamic discovery (less flexible when tools change)
- No checkpoint/resume for long-running tasks (risky on interruption but rare in practice)

## Tier assignment rules

Precedence, highest first; apply exactly one:

1. **The rule's own surface-override table** (in the rule file). Most carry one; it is authoritative.
2. **The generic surface adjustment below**: only for rules with no override row for the surface.
3. **The rule's `defaultTier`.**

Never stack adjustments: a rule whose table already says `release-blocker` on tool execution is not bumped again.

| Surface context | Generic adjustment |
|---|---|
| Agent tool execution / action panel | Bump 1 tier (sprint → blocker; backlog → sprint): autonomous actions demand higher safety |
| Agent chat / copilot | No adjustment: conversational surfaces tolerate slightly more friction |
| Agent config / system prompt editor | No adjustment |
| Agent dashboard / status | Down 1 tier (blocker → sprint; sprint → backlog): monitoring is less critical than action surfaces |

## Verdict logic

Aggregate the per-finding tiers into a top-level verdict (shown in the summary block at the top of every report):

| Verdict | Condition |
|---|---|
| ✅ READY | 0 release-blockers AND ≤3 fix-this-sprint |
| ⚠️ READY WITH FOLLOW-UP | 0 release-blockers AND ≥4 fix-this-sprint |
| ❌ NOT READY | ≥1 release-blocker |
| 🚫 INCOMPLETE | Audit-self-check failed; re-run |

Justify every assigned tier in `tierReason` ("release-blocker because agent action panel"). Bare tiers without that sentence are incomplete.

Tier per finding, not per rule: a rule's `defaultTier` is where the assignment starts, and the surface decides where it lands.

Two ways to get this wrong, both of which cost the verdict its meaning:

- **Inflation.** Everything becomes `release-blocker`. One inflated finding flips the whole PR to ❌ NOT READY, so a report that does this twice teaches the team to read the verdict as noise and merge anyway.
- **Deflation.** Everything slides to `backlog` for a greener verdict. That reads well once and catches up at the next production incident.

The test for either: if a finding could not honestly block a merge, it is not a blocker; if it would cause user harm, it is not backlog.
