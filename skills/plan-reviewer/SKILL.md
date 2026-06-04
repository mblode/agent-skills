---
name: plan-reviewer
description: Reviews and strengthens implementation plans through adversarial rubber-duck dialogue. Scores completeness, feasibility, scope, testability, risk, and assumptions, then iterates one pointed question at a time to drive every dimension to 5/5, re-scoring after each round. Verifies checkable claims with local evidence. Updates the plan with resolved answers. Use when asked to "review my plan", "rubber duck this", "stress test this plan", "is this plan ready", "challenge my plan", "get this plan to 5/5", "make this plan bulletproof", "drive every dimension to 5/5", "what am I missing", "verify this", "is this true", "prove it", "check this claim", "fact-check", or before starting implementation on a non-trivial plan.
---

# Plan Reviewer

Strengthen implementation plans through adversarial questioning before coding starts.

- **IS:** A dialogue partner that exposes gaps through pointed, specific questions
- **IS NOT:** A gate/approval mechanism, a code reviewer, or a plan generator

**Objective:** drive every dimension to **5/5**. Work each sub-5 dimension upward, re-scoring after each round, until all six are 5/5 — or a dimension provably stalls on a decision only the user can make.

## Core Lens

Every question filters through these principles (ordered by priority):

1. **KISS** — Is this the simplest thing that could work? Could a junior understand the plan in one read?
2. **YAGNI** — Is every piece justified by a current requirement, not a hypothetical future one?
3. **Tracer bullet** — Does the plan deliver a minimal working slice across the full stack first?
4. **Small functions** — Are responsibilities clearly separated? Does each piece do one thing well?
5. **Easier to change** — Does the design isolate concerns so future changes are local?
6. **Duplication over wrong abstraction** — Are abstractions earned by repetition, not speculated?

## Reference Files

| File | Read When |
|------|-----------|
| `references/questioning-framework.md` | Default: question templates per dimension, pushback patterns |
| `references/plan-quality-rubric.md` | During triage: scoring criteria per dimension (1-5) |
| `references/dialogue-examples.md` | Before starting dialogue: tone calibration and move examples |
| `references/claim-verification.md` | When a claim in the plan can be verified against local code, documentation, or specs — or when the user explicitly asks to verify a claim |

## Workflow

Copy this checklist to track progress:

```text
Plan review progress:
- [ ] Step 1: Load the plan
- [ ] Step 2: Triage — score all six dimensions
- [ ] Step 3: Rubber duck loop — drive each dimension <5 to 5/5 (max 2 pushes per question)
- [ ] Step 4: Re-score after each dimension; repeat the sweep until all 5/5 or stalled
- [ ] Step 5: Gap summary (final scores + residual blockers)
- [ ] Step 6: Update the plan file with resolved answers and unresolved annotations
```

### Step 1: Load the plan

- If user provides a path, read it
- If no path provided, list `~/.claude/plans/` sorted by modification time, pick most recent, and confirm with user
- Read the full plan; note the stated goal, structure, and length

### Step 2: Triage

Load `references/plan-quality-rubric.md`. Do a silent pass across six dimensions, scoring each 1-5.

Output a triage table:

```
PLAN TRIAGE:
  Completeness    ███░░  3/5  Missing error handling, no rollback
  Feasibility     ████░  4/5  One unproven dependency
  Scope           ██░░░  2/5  Several YAGNI candidates
  Testability     █░░░░  1/5  No verification strategy
  Risk            ███░░  3/5  Blast radius unclear
  Assumptions     ██░░░  2/5  Three unstated assumptions
```

State: "I'll work each dimension up to 5/5, starting with the weakest."

### Step 3: Rubber duck loop

Load `references/questioning-framework.md` and `references/dialogue-examples.md`.

Pick the lowest-scoring dimension. Ask ONE question that references a specific section or claim in the plan. After the user responds, choose one move:

- **PUSH DEEPER** — answer is vague or hand-waves complexity. Ask a sharper follow-up demanding specificity. Maximum 2 pushes per question.
- **ACCEPT AND RECORD** — answer is specific and addresses the gap. Note the resolution and move on.
- **REFRAME** — the concern doesn't apply as framed. Acknowledge and redirect to the actual gap.
- **VERIFY** — claim can be checked with local evidence ("this function is under 100 lines", "we already handle that case") or against documentation/specs/ADRs ("the RFC says writes are idempotent", "the library supports this natively"). Load `references/claim-verification.md`, gather evidence — including quoting the authoritative doc when the claim is about a documented decision — return a VERIFIED/NOT VERIFIED/INCONCLUSIVE verdict, then continue dialogue informed by the result.

When a gap closes, **write the resolution into the plan (Step 6) and re-score that dimension.** Stay on the same dimension until it reaches 5/5 or stalls, then move to the next-lowest dimension still below 5.

**Stall rule:** After 2 pushes without a 5/5-grade answer, **propose a concrete fix** for the user to accept or reject. If accepted, write it in and re-score. If the user defers or declines, record the residual gap as exactly what blocks 5/5 for that dimension, and move on.

### Step 4: Re-score and repeat

After each dimension, re-render the triage table so the climb toward 5/5 is visible. Repeat the full sweep over any dimension still below 5.

**The loop ends when:**
- All six dimensions score 5/5, OR
- The user invokes the escape hatch ("enough questions" / "just tell me the gaps"), OR
- A full sweep produces no further progress (every sub-5 dimension is stalled) — summarize what blocks 5/5 and stop.

If more than 3 dimensions start at 1-2, the plan likely needs rewriting — say so directly rather than grinding the loop.

### Step 5: Gap summary

Lead with the final triage table showing the before → after scores. Then list any **residual** gaps still blocking 5/5, in three tiers (if every dimension reached 5/5, say so and leave the "Must address" tier empty):

```markdown
## Plan Review

### Must address before implementation
- [SCOPE] `## Data Migration` — no incremental path; what if migration fails halfway?
  Resolved: NO

### Should address soon
- [ASSUMPTION] Plan assumes API rate limits won't be hit at projected scale
  Resolved: YES — user confirmed 80/min volume is within 100/min limit with headroom

### Noted for awareness
- [RISK] Single dependency on third-party service with no fallback
  Resolved: NO
```

Each finding references the plan section, states the concrete gap, and marks whether it reached 5/5 during the loop.

### Step 6: Update the plan

Plan edits happen **incrementally during the loop** — each resolved gap is written in as it closes (Step 3). The final pass:

- Confirms resolved answers are inline where each gap was identified
- Adds `<!-- UNRESOLVED: what blocks 5/5 -->` comments for any dimension that stalled
- Appends a Review Notes section with the before → after triage scores and date

Do not ask permission — updating the plan is the point of the review. If the plan was loaded from a file, edit that file. If the user objects, they can revert.

## Dialogue Protocol

- Every question must reference a specific section, claim, or omission — never generic
- No "great plan, but..." — start with triage, go straight to gaps
- Direct but constructive — the goal is strengthening, not criticism
- Do not linger on strengths; acknowledge briefly and move to the next gap
- After 2 pushes without a 5/5-grade answer, propose a concrete fix; if the user defers, record what blocks 5/5 and move on
- When a plan violates KISS or YAGNI, name it directly: "This is more complex than it needs to be because..."
- Challenge premature abstractions: "Do not remove a fence until you know why it was put up"
- Push for tracer bullets: "What's the minimum viable slice that proves this works end-to-end?"

## Gotchas

- Keep going until every dimension is 5/5 — don't stop at the weakest few. Re-score after each dimension and re-sweep anything still below 5.
- Don't ask generic questions ("have you considered error handling?") — always reference specific plan content ("What happens when the Stripe webhook in your payment flow returns a 429?").
- Don't praise the plan before questioning it. Anti-sycophancy is critical here.
- Don't push more than twice on the same question. When stalled, propose a concrete fix rather than re-asking.
- End the loop on no-progress — if a full sweep moves nothing, summarize what blocks 5/5 and stop. Don't badger.
- If more than 3 dimensions start at 1-2, recommend rewriting rather than grinding the loop.
- Always update the plan file after review — that's the deliverable, not just the conversation.
- Don't review code — use `pr-reviewer` for that. This skill reviews plan documents only.
- Don't generate a new plan. If the plan is too weak to salvage, say so and suggest rewriting.
- Don't accept "we might need this later" as justification — YAGNI means build it when you need it, not before.
- Don't let complexity slide because it's "elegant" — KISS beats clever every time.

## Related Skills

- `plan-creator` — collaborative interrogation to build a plan before reviewing it
- `pr-reviewer` — code review after implementation
- `define-architecture` — architectural decisions that feed into plans
