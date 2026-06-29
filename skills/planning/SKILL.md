---
name: planning
description: >-
  Builds and stress-tests implementation plans in two modes. Create mode scans
  code and docs, asks one question at a time with a recommended answer, then
  writes a plan file. Review mode scores completeness, feasibility, scope,
  testability, risk, and assumptions, verifies checkable claims, and writes
  resolutions back until every dimension reaches 5/5. Use when asked to "create
  a plan", "plan this feature", "I want to build X", "grill me", "think this
  through", "review my plan", "rubber duck this", "stress test this plan", "is
  this plan ready", "get this plan to 5/5", "what am I missing", "verify this
  claim", "prove this plan", "fact-check this plan", or when the user
  explicitly wants a plan artifact before implementation. For code review use
  pr-reviewer; for architecture briefs use define-architecture.
---

# Planning

Build a plan by collaborative interrogation, then stress-test it adversarially, before coding. The deliverable is always a plan file, never code.

- **IS:** building a plan from intent through one-question-at-a-time interrogation (Create), and strengthening an existing plan by scoring six dimensions to 5/5 with claim verification (Review). Both write to the plan file.
- **IS NOT:** implementing or generating code, authoring a PR (use `pr-creator`), reviewing a code diff (use `pr-reviewer`), or writing an architecture brief (use `define-architecture`).

Pipeline position: `planning` (create then review) -> implementation -> `pr-reviewer` -> `pr-creator` -> `pr-babysitter`.

## Mode dispatch

Auto-detect; ask only if genuinely ambiguous:

- **No plan file in scope**, or verbs like "create a plan", "plan this", "grill me", "think this through" -> **Create mode**.
- **Existing plan in scope** (a path, pasted plan, or recent file in the active agent's native plan directory), or verbs like "review my plan", "stress test", "is this ready", "get this to 5/5", "verify this claim", "fact-check this plan" -> **Review mode**.
- **No plan in scope but the user asks to verify or fact-check a standalone claim** -> answer directly with local evidence; create no plan artifact.
- If the input is code or a diff rather than a plan, stop and route to `pr-reviewer`.

Create hands off to Review; a plan is not ready for implementation until Review passes.

## Decision principles

Use these to cut scope, sequence work, and challenge the plan. Turn each into a plan edit; never cite slogans.

1. **KISS:** fewest moving parts that satisfy the current requirement. Delete layers, modes, config, or coordination that do not change the first shippable outcome.
2. **As simple as possible, no simpler:** never cut correctness, permissions, observability, rollback, migration safety, or required edge states. A smaller plan that drops a current requirement is too small.
3. **YAGNI:** defer extension points, future providers, generic frameworks, and speculative settings until a named current requirement needs them.
4. **Proven practice:** when the ecosystem or repo has a proven pattern for this exact problem, use it and name the precedent. Invent a local pattern only when a concrete constraint makes the standard one fail.
5. **Easier to change:** make the next likely requirement local. Name what file, module, table, or API boundary changes later, and what stays untouched.
6. **Tracer bullet:** prove the approach with one minimum viable vertical slice across the real boundary before building horizontal layers.
7. **DRY:** deduplicate knowledge, invariants, protocols, and business rules, not coincidental shape.
8. **Duplication over wrong abstraction:** keep similar code duplicated when the shared abstraction would hide different business rules, lifecycles, owners, or failure modes.

Conflict rule: current requirements win first. Then `as simple as possible, no simpler` bounds KISS and YAGNI; `duplication over wrong abstraction` bounds DRY; `tracer bullet` beats horizontal foundation work unless the project cannot run without that foundation.

## Reference files

| File | Mode | Read when |
|------|------|-----------|
| `references/interrogation-protocol.md` | Create | Create Step 2: question decision tree, recommended-answer format, fuzzy-term patterns, anti-rationalization table |
| `references/doc-grounding.md` | Create | Create Step 1, when design docs, RFCs, ADRs, or library/API docs are relevant: find them, extract the decisions they encode, grill the rationale |
| `references/html-question-form.md` | Create | Create Step 2, optional: batched HTML question form for large or greenfield specs instead of one-at-a-time chat |
| `references/plan-quality-rubric.md` | Review | Review Step 2 triage: 1-5 scoring criteria per dimension |
| `references/questioning-framework.md` | Review | Review Step 3: question templates and pushback patterns per dimension |
| `references/dialogue-examples.md` | Review | Before the Review dialogue: tone calibration and all four moves in action |
| `references/claim-verification.md` | Review | When a claim is checkable against local code, docs, or specs, or the user asks to verify one |

## Create mode

```text
Create progress:
- [ ] Step 1: Understand intent (read the request, scan code and docs, state findings)
- [ ] Step 2: Interrogate (one question at a time; end with the "radically simpler?" challenge)
- [ ] Step 3: Synthesize (write the plan file, format matched to scope)
- [ ] Step 4: Validate (check the plan against the original request, report the path)
- [ ] Step 5: Hand off to Review mode
```

### Step 1: Understand intent

Before asking, scan code and docs:

- Identify modules, files, and patterns related to the request; note conventions, abstractions, boundaries, and prior art.
- Read relevant design docs, RFCs, ADRs, READMEs, referenced library/API docs, and any spec the user points to. Load `references/doc-grounding.md` to find docs and extract their decisions and rationale.

State findings in 2-3 sentences before the first question.

### Step 2: Interrogate

Load `references/interrogation-protocol.md`. Ask ONE question at a time. Every question carries a **recommended answer** grounded in Step 1: name the file, function, approach.

- If code or docs can answer it, answer it yourself; never spend a user question on it.
- Each answer shapes the next. Walk the decision tree: resolve intent and scope before approach, approach before risks.
- Flag fuzzy terms ("handle auth", "make it fast"): propose a sharp version and ask if it is right.
- Surface tensions with existing code: "The codebase does X. You're proposing Y. Which wins?"
- **Grill the core decisions:** when docs reveal a decision, interrogate *why* it was made and whether the rationale still holds. Never re-ask what docs answer; pressure-test the reasoning.

**Budget:** 5-10 questions, then synthesize.

**Mandatory scope challenge (before synthesizing):** ask "What can we cut without dropping a current requirement?" Carry a recommended cut list: removed extension points, setup collapsed into the first vertical slice, abstractions kept only when they protect a shared invariant/owner/lifecycle, and safety gates preserved where "simpler" would drop correctness. Challenge the *sum* of the plan, not each piece.

**Batch mode (optional):** for large or greenfield specs with many independent questions, generate one local HTML form. Load `references/html-question-form.md` for the template and batch-vs-sequential table. Default to one-at-a-time when answers should shape later questions.

**Escape hatch:** if the user says "just write the plan", push back once via the anti-rationalization table, then respect their call and skip to Step 3.

### Step 3: Synthesize

Write the plan file to the active agent's native plan directory when one exists; otherwise to the user-specified path or the repo-local plan location set by project instructions. Match format to scope.

**Lightweight** (single file, clear approach): `# Title`, `## Context` (one paragraph), `## Approach`.

**Standard** (multiple files, decisions made): `# Title`, `## Context` (problem, what prompted it, intended outcome), `## Approach` (recommended only), `## Key decisions` (brief rationale), `## Files to modify` (grouped by purpose), `## Out of scope` (related-looking things that must not change, each with a reason), `## Verification` (each item a command plus expected result).

Keep plans scannable yet executable without re-reading the conversation. Record only the chosen approach; rejected alternatives become one-line rationale under Key decisions.

**Handoff plans:** when another agent or session will execute, the executor has not seen this conversation. Inline any code excerpts and conventions it needs (with `file:line` markers), and add a **STOP conditions** section: assumptions that, if false, mean stop and report back rather than improvise.

### Step 4: Validate

- Does the plan answer the user's original request?
- Did every interrogation answer land in the plan? An answer that never made it in was a wasted question.
- **Scope gate:** the plan fails if it violates any decision principle, especially an unneeded extension point, horizontal setup before the first tracer bullet, or a cut that drops required correctness, permissions, rollback, migration safety, or edge states.
- Any unstated assumptions that should be explicit?

Fix failures in the plan directly; don't reopen the interrogation. Report the plan path and confirm each check passed.

### Step 5: Hand off

Offer Review: "Plan written to `<path>`. Stress-test it to 5/5 before implementation?"

## Review mode

**Objective:** drive all six dimensions to **5/5**. Work each sub-5 dimension upward, re-scoring each round, until all are 5/5 or provably stalled on a decision only the user can make.

```text
Review progress:
- [ ] Step 1: Load the plan
- [ ] Step 2: Triage: verify checkable claims, score all six dimensions
- [ ] Step 3: Rubber duck loop: drive each dimension <5 to 5/5 (max 2 pushes per question)
- [ ] Step 4: Re-score after each dimension; repeat the sweep until all 5/5 or stalled
- [ ] Step 5: Gap summary (before/after scores + residual blockers)
- [ ] Step 6: Confirm the plan file contains every resolution and unresolved annotation
```

### Step 1: Load the plan

If the user gives a path, read it. Otherwise list the active agent's native plan directory by modification time, pick the most recent, and confirm. Read the full plan; note its goal, structure, length. If it is a diff or code, stop and route to `pr-reviewer`.

### Step 2: Triage

Load `references/plan-quality-rubric.md`. Silently score each of the six dimensions 1-5. While scoring, mark every claim checkable against local code, docs, or specs; verify the load-bearing ones now (load `references/claim-verification.md`) and fold the verdicts into the scores. Never spend a dialogue turn on what the codebase can answer.

Output a triage table:

```
PLAN TRIAGE:
  Completeness    ███░░  3/5  Missing error handling, no rollback
  Feasibility     ████░  4/5  One unproven dependency
  Scope           ██░░░  2/5  Premature abstractions
  Testability     █░░░░  1/5  No verification strategy
  Risk            ███░░  3/5  Blast radius unclear
  Assumptions     ██░░░  2/5  Three unstated assumptions
```

State: "I'll work each dimension up to 5/5, starting with the weakest." If more than 3 dimensions start at 1-2, the plan needs rewriting, not review: switch to Create mode instead of grinding the loop.

### Step 3: Rubber duck loop

Load `references/questioning-framework.md` and `references/dialogue-examples.md`. Each round:

1. Pick the lowest-scoring dimension still below 5.
2. Ask ONE question that quotes or names a specific section, claim, or omission. Never bundle two questions.
3. On the answer, choose exactly one move:

- **VERIFY:** the answer or the plan text it defends is checkable with local evidence. Load `references/claim-verification.md`, gather evidence, quote the authoritative doc, return VERIFIED / NOT VERIFIED / INCONCLUSIVE, then continue informed. Prefer VERIFY over asking when evidence can settle it.
- **PUSH DEEPER:** the answer hand-waves complexity. Ask a sharper follow-up. Max 2 pushes per question.
- **ACCEPT AND RECORD:** the answer closes the gap. Write the resolution into the plan file immediately, then re-score the dimension.
- **REFRAME:** the concern does not apply as framed. Acknowledge what the user got right, then redirect to the actual gap.

Stay on the same dimension until it reaches 5/5 or stalls, then move to the next-lowest below 5.

**Stall rule:** after 2 pushes without a 5/5 answer, propose a concrete fix to accept or reject. If accepted, write it in and re-score. If the user defers, record what blocks 5/5 and move on. Don't keep re-asking in different words.

### Step 4: Re-score and repeat

After each dimension closes or stalls, re-render the triage table so the climb is visible. Sweep again over any dimension below 5. The loop ends when all six are 5/5, the user invokes the escape hatch, or a full sweep makes no progress (summarize what blocks 5/5 and stop).

### Step 5: Gap summary

Lead with the final triage table (before and after). List residual gaps in three tiers; if every dimension reached 5/5, say so and leave "Must address" empty.

```markdown
## Plan Review

### Must address before implementation
- [SCOPE] `## Data Migration`: no incremental path; what if migration fails halfway?
  Resolved: NO

### Should address soon
- [ASSUMPTION] Plan assumes API rate limits won't be hit at projected scale
  Resolved: YES (user confirmed 80/min is within the 100/min limit with headroom)

### Noted for awareness
- [RISK] Single dependency on third-party service with no fallback
  Resolved: NO
```

### Step 6: Confirm the plan file

Plan edits happen incrementally during the loop; this final pass confirms the file is the deliverable: every resolution inline where its gap was identified; every stalled dimension carries a `<!-- UNRESOLVED: what blocks 5/5 -->` comment; a Review Notes section appended with before/after triage scores and the date. Do not ask permission to edit; updating the plan is the point. If the plan arrived as pasted text with no file, output the full updated plan in a code block and offer to write it to the active agent's native plan directory or a user-specified path.

### Review dialogue protocol

- Quote the plan's words when challenging; paraphrase invites "that's not what I meant" detours.
- No "great plan, but...": start with the triage table and go straight to gaps. Acknowledge strengths in one clause at most.
- Direct but constructive; aim to strengthen, not criticize.
- Name scope creep, unearned abstractions, and horizontal-layer plans explicitly. Push for the minimum executable slice that proves the approach end-to-end.

## Gotchas

- Explore before asking. Never ask what code or docs answer; ask about rationale and tradeoffs instead.
- Create mode: each question needs a recommended answer and stays collaborative. Stop at 10 questions and propose a split.
- Review mode: one question per turn, apply each accepted resolution immediately, use the stall rule after two failed pushes.
- Use batch questions only in explicit HTML batch mode.
- Do not implement. The deliverable is the plan file.
- Verification steps need a command and expected result, never just "verify it works".

## Related skills

Pipeline: `planning` -> implementation -> `pr-reviewer` -> `pr-creator` -> `pr-babysitter`.

- `pr-reviewer`: code review after implementation; route here the moment the input is code, not a plan.
- `pr-creator`: opens the PR once the plan is implemented.
- `define-architecture`: architectural decisions that feed into plans.
