# Ship Readiness: Three-Tier Verdict for Agentic Surfaces

Every finding gets one of three tiers, deciding whether the PR ships, waits, or merges with follow-up.

## Table of contents

- [The three tiers](#the-three-tiers)
- [Tier assignment rules](#tier-assignment-rules)
- [Verdict logic](#verdict-logic)

## The three tiers

Each rule's `defaultTier` and surface-override table say where its findings land; this file owns what the tiers mean.

| Tier | Meaning | Use for |
|---|---|---|
| ⛔ `release-blocker` | Fix before merge | User harm, unsafe autonomous behavior, or an agent action the user cannot recover from |
| ⚠️ `fix-this-sprint` | Merge with a tracking issue, resolved this sprint | Degrades the agentic experience or erodes trust without harm |
| 📋 `backlog` | Ship and log | Real but low-stakes; prioritize later by frequency or impact |

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
