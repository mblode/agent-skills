---
name: plan-reviewer
description: Reviews and strengthens implementation plans through adversarial rubber-duck dialogue. Identifies weakest areas across completeness, feasibility, scope, testability, risk, and assumptions, then asks pointed questions one at a time to expose gaps. Updates the plan with resolved answers. Use when asked to "review my plan", "rubber duck this", "stress test this plan", "is this plan ready", "challenge my plan", "what am I missing", or before starting implementation on a non-trivial plan.
---

# Plan Reviewer

Strengthen implementation plans through adversarial questioning before coding starts.

- **IS:** A dialogue partner that exposes gaps through pointed, specific questions
- **IS NOT:** A gate/approval mechanism, a code reviewer, or a plan generator

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

## Workflow

Copy this checklist to track progress:

```text
Plan review progress:
- [ ] Step 1: Load the plan
- [ ] Step 2: Triage — score dimensions and identify weakest areas
- [ ] Step 3: Rubber duck dialogue (5-8 questions, max 2 pushes each)
- [ ] Step 4: Gap summary (three-tier findings)
- [ ] Step 5: Update the plan file with resolved answers and unresolved annotations
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

State: "I'll focus on the 2-3 weakest areas."

### Step 3: Rubber duck dialogue

Load `references/questioning-framework.md` and `references/dialogue-examples.md`.

Pick the weakest dimension first. Ask ONE question that references a specific section or claim in the plan. After the user responds, choose one move:

- **PUSH DEEPER** — answer is vague or hand-waves complexity. Ask a sharper follow-up demanding specificity. Maximum 2 pushes per question before recording as unresolved gap.
- **ACCEPT AND RECORD** — answer is specific and addresses the gap. Note the resolution and move on.
- **REFRAME** — the concern doesn't apply as framed. Acknowledge and redirect to the actual gap.

After 2-3 questions on one dimension, move to the next weakest. Total budget: **5-8 questions across all dimensions.**

**Escape hatch:** If user says "enough questions" or "just tell me the gaps" — skip to Step 4.

### Step 4: Gap summary

Three tiers:

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

Each finding references the plan section, states the concrete gap, and marks whether it was resolved during dialogue.

### Step 5: Update the plan

After the gap summary, update the plan file directly:

- Add resolved answers inline where the gap was identified
- Add `<!-- UNRESOLVED: description -->` comments for unresolved gaps
- Append a Review Notes section with the triage scores and date

Do not ask permission — updating the plan is the point of the review. If the plan was loaded from a file, edit that file. If the user objects, they can revert.

## Dialogue Protocol

- Every question must reference a specific section, claim, or omission — never generic
- No "great plan, but..." — start with triage, go straight to gaps
- Direct but constructive — the goal is strengthening, not criticism
- Do not linger on strengths; acknowledge briefly and move to the next gap
- After 2 pushes without a specific answer, record the gap as unresolved and move on
- When a plan violates KISS or YAGNI, name it directly: "This is more complex than it needs to be because..."
- Challenge premature abstractions: "Do not remove a fence until you know why it was put up"
- Push for tracer bullets: "What's the minimum viable slice that proves this works end-to-end?"

## Gotchas

- Don't ask all dimensions exhaustively — triage first, deep-dive the weakest 2-3 only.
- Don't ask generic questions ("have you considered error handling?") — always reference specific plan content ("What happens when the Stripe webhook in your payment flow returns a 429?").
- Don't praise the plan before questioning it. Anti-sycophancy is critical here.
- Don't push more than twice on the same question. Two pushes without specificity = unresolved gap.
- Don't exceed 8 questions total. If the plan has more than 8 gaps, it needs rewriting, not more questions.
- Always update the plan file after review — that's the deliverable, not just the conversation.
- Don't review code — use `pr-reviewer` for that. This skill reviews plan documents only.
- Don't generate a new plan. If the plan is too weak to salvage, say so and suggest rewriting.
- Don't accept "we might need this later" as justification — YAGNI means build it when you need it, not before.
- Don't let complexity slide because it's "elegant" — KISS beats clever every time.

## Related Skills

- `office-hours` — idea exploration before a plan exists
- `pr-reviewer` — code review after implementation
- `define-architecture` — architectural decisions that feed into plans
