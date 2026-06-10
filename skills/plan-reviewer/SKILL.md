---
name: plan-reviewer
description: Reviews and strengthens an existing implementation plan through adversarial rubber-duck dialogue. Scores completeness, feasibility, scope, testability, risk, and assumptions, asks one pointed question at a time, verifies checkable claims against local code and docs, and writes resolved answers back into the plan file until every dimension reaches 5/5. Use when asked to "review my plan", "rubber duck this", "stress test this plan", "is this plan ready", "challenge my plan", "get this plan to 5/5", "make this plan bulletproof", "what am I missing", "verify this", "is this true", "prove it", "check this claim", "fact-check", or before starting implementation on a non-trivial plan. For creating a plan from scratch, use plan-creator. For reviewing a code diff, use pr-reviewer.
---

# Plan Reviewer

Strengthen an existing implementation plan through adversarial questioning before coding starts.

- **IS:** Adversarial review of an existing plan: pointed questions one at a time, claim verification against local code and docs, resolutions written directly into the plan file
- **IS NOT:** Creating a plan from scratch (use `plan-creator`), reviewing a code diff (use `pr-reviewer`), or a gate that approves and rejects

**Objective:** drive all six dimensions to **5/5**. Work each sub-5 dimension upward, re-scoring after each round, until every dimension is 5/5 or provably stalled on a decision only the user can make.

## Core Lens

Filter every question through these principles, in priority order:

1. **KISS**: is this the simplest thing that could work? Could a junior understand the plan in one read?
2. **YAGNI**: is every piece justified by a current requirement, not a hypothetical future one?
3. **Tracer bullet**: does the plan deliver a minimal working slice across the full stack first?
4. **Small functions**: are responsibilities clearly separated? Does each piece do one thing well?
5. **Easier to change**: does the design isolate concerns so future changes are local?
6. **Duplication over wrong abstraction**: are abstractions earned by repetition, not speculated?

## Reference Files

| File | Read When |
|------|-----------|
| `references/questioning-framework.md` | Default: question templates and pushback patterns per dimension |
| `references/plan-quality-rubric.md` | During triage: 1-5 scoring criteria per dimension |
| `references/dialogue-examples.md` | Before starting dialogue: tone calibration and all four moves in action |
| `references/claim-verification.md` | Whenever a claim is checkable against local code, docs, or specs, or the user asks to verify a claim |

## Workflow

Copy this checklist to track progress:

```text
Plan review progress:
- [ ] Step 1: Load the plan
- [ ] Step 2: Triage: verify checkable claims, score all six dimensions
- [ ] Step 3: Rubber duck loop: drive each dimension <5 to 5/5 (max 2 pushes per question)
- [ ] Step 4: Re-score after each dimension; repeat the sweep until all 5/5 or stalled
- [ ] Step 5: Gap summary (before/after scores + residual blockers)
- [ ] Step 6: Confirm the plan file contains every resolution and unresolved annotation
```

### Step 1: Load the plan

- If the user provides a path, read it
- If no path is provided, list `~/.claude/plans/` sorted by modification time, pick the most recent, and confirm with the user
- Read the full plan; note the stated goal, structure, and length
- If the document turns out to be a diff or code rather than a plan, stop and route to `pr-reviewer`

### Step 2: Triage

Load `references/plan-quality-rubric.md`. Do a silent pass across the six dimensions, scoring each 1-5.

While scoring, mark every claim that is checkable against local code, docs, or specs ("nobody uses this", "the library supports X", "we already handle that case"). Verify the load-bearing ones yourself now (load `references/claim-verification.md`) and fold the verdicts into the scores. Never spend a dialogue turn asking the user something the codebase can answer.

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

If more than 3 dimensions start at 1-2, the plan needs rewriting, not review. Say so directly and suggest `plan-creator` instead of grinding the loop.

### Step 3: Rubber duck loop

Load `references/questioning-framework.md` and `references/dialogue-examples.md`.

Each round:

1. Pick the lowest-scoring dimension still below 5.
2. Ask ONE question that quotes or names a specific section, claim, or omission in the plan. Never bundle two questions into one turn.
3. On the user's answer, choose exactly one move:

- **VERIFY**: the answer (or the plan text it defends) is checkable with local evidence ("this function is under 100 lines", "the RFC says writes are idempotent"). Load `references/claim-verification.md`, gather evidence, quote the authoritative doc when the claim is about a documented decision, return a VERIFIED / NOT VERIFIED / INCONCLUSIVE verdict, then continue informed by it. Prefer VERIFY over asking whenever evidence can settle the point.
- **PUSH DEEPER**: the answer is vague or hand-waves complexity. Ask a sharper follow-up demanding specifics. Maximum 2 pushes per question.
- **ACCEPT AND RECORD**: the answer is specific and closes the gap. Write the resolution into the plan file immediately, then re-score the dimension.
- **REFRAME**: the concern does not apply as framed. Acknowledge what the user got right, then redirect to the actual gap.

Stay on the same dimension until it reaches 5/5 or stalls, then move to the next-lowest dimension still below 5.

**Stall rule:** after 2 pushes without a 5/5-grade answer, propose a concrete fix for the user to accept or reject. If accepted, write it into the plan and re-score. If the user defers or declines, record exactly what blocks 5/5 for that dimension and move on. This is the only stall procedure; do not keep re-asking in different words.

### Step 4: Re-score and repeat

After each dimension closes or stalls, re-render the triage table so the climb toward 5/5 is visible. Sweep again over any dimension still below 5.

The loop ends when:

- All six dimensions score 5/5, OR
- The user invokes the escape hatch ("enough questions" / "just tell me the gaps"), OR
- A full sweep produces no progress (every sub-5 dimension is stalled): summarize what blocks 5/5 and stop

### Step 5: Gap summary

Lead with the final triage table showing before and after scores. Then list any residual gaps still blocking 5/5 in three tiers. If every dimension reached 5/5, say so and leave the "Must address" tier empty.

```markdown
## Plan Review

### Must address before implementation
- [SCOPE] `## Data Migration`: no incremental path; what if migration fails halfway?
  Resolved: NO

### Should address soon
- [ASSUMPTION] Plan assumes API rate limits won't be hit at projected scale
  Resolved: YES (user confirmed 80/min volume is within the 100/min limit with headroom)

### Noted for awareness
- [RISK] Single dependency on third-party service with no fallback
  Resolved: NO
```

Each finding references the plan section, states the concrete gap, and marks whether it was resolved during the loop.

### Step 6: Confirm the plan file

Plan edits happen incrementally during the loop: each resolved gap is written in the moment it closes (Step 3). This final pass confirms the file is the deliverable:

- Every resolution is inline where its gap was identified
- Every stalled dimension has a `<!-- UNRESOLVED: what blocks 5/5 -->` comment at the relevant section
- A Review Notes section is appended with the before/after triage scores and the date

Do not ask permission to edit. Updating the plan file is the point of the review; if the user objects, they can revert. If the plan arrived as pasted text with no file, output the full updated plan in a code block and offer to write it to `~/.claude/plans/`.

## Dialogue Protocol

- Quote the plan's own words when challenging them; paraphrase invites "that's not what I meant" detours
- No "great plan, but...": start with the triage table and go straight to gaps
- Acknowledge strengths in one clause at most, then move to the next gap
- Direct but constructive; the goal is strengthening, not criticism
- Name KISS and YAGNI violations explicitly: "This is more complex than the goal requires because..."
- Challenge premature abstractions: "Do not remove a fence until you know why it was put up"
- Push for tracer bullets: "What's the minimum viable slice that proves this works end-to-end?"

## Gotchas

- Asking the user a question grep can answer ("is legacyHelper still used?") wastes a turn and invites guessing; run the verification yourself and present the evidence.
- Bundling two questions into one turn gets one answered and one silently dropped, usually the harder one. One question per turn.
- Praising the plan before the first question anchors the user defensively and produces softer answers. Open with the triage table, not a compliment.
- A third push on the same question stops yielding information; users start inventing answers to end the interrogation. Invoke the stall rule instead.
- Accepting "we might need this later" leaves a YAGNI violation in the plan; require a current requirement or cut the item.
- Deferring plan edits to the end loses resolutions agreed mid-dialogue; write each one into the file the moment it closes.
- Asking permission to update the plan file undermines the deliverable; edit directly, the user can revert.
- Skipping the re-rendered triage table after each dimension hides whether the loop is progressing; without it, stalls and progress look identical.
- Generic questions ("have you considered error handling?") get generic answers; every question must name a section, claim, or omission from this plan.
- Reviewing a code diff here produces plan-shaped feedback about code; route to `pr-reviewer` the moment the input is code, not a plan.

## Related Skills

- `plan-creator`: collaborative interrogation to build a plan before reviewing it
- `pr-reviewer`: code review after implementation
- `define-architecture`: architectural decisions that feed into plans
