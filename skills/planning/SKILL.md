---
name: planning
description: >-
  Builds and stress-tests implementation plans before any code is written, in
  two modes. Create mode runs a collaborative interrogation: explores the
  codebase and docs, asks one question at a time with a recommended answer,
  grills documented decisions, then writes a plan file. Review mode runs an
  adversarial rubber-duck pass: scores completeness, feasibility, scope,
  testability, risk, and assumptions, verifies checkable claims against local
  code and docs, and writes resolutions back into the plan until every
  dimension reaches 5/5. Use when asked to "create a plan", "plan this
  feature", "I want to build X", "grill me", "think this through", "review my
  plan", "rubber duck this", "stress test this plan", "is this plan ready",
  "get this plan to 5/5", "what am I missing", "verify this", "prove it", or
  "fact-check", or before any non-trivial implementation. For reviewing a code
  diff use pr-reviewer; for opening the PR use pr-creator; for architecture
  decisions use define-architecture.
---

# Planning

Build a plan through collaborative interrogation, then stress-test it adversarially, before coding starts. The deliverable is always a plan file, never code.

- **IS:** building a plan from intent through one-question-at-a-time interrogation (Create), and strengthening an existing plan by scoring six dimensions to 5/5 with claim verification (Review). Both write to the plan file.
- **IS NOT:** implementing or generating code, authoring a PR (use `pr-creator`), or reviewing a code diff (use `pr-reviewer`).

Pipeline position: `planning` (create then review) -> implementation -> `pr-reviewer` -> `pr-creator` -> `pr-babysitter`.

## Mode dispatch

Auto-detect; do not ask unless genuinely ambiguous:

- **No plan file in scope**, or verbs like "create a plan", "plan this", "grill me", "think this through" -> **Create mode**.
- **An existing plan in scope** (a path, or a recent file in `~/.claude/plans/`), or verbs like "review my plan", "stress test", "is this ready", "get this to 5/5", "verify this claim", "fact-check" -> **Review mode**.
- If the input turns out to be code or a diff rather than a plan, stop and route to `pr-reviewer`.

Create naturally hands off to Review; a plan is not ready for implementation until Review passes.

## Reference files

| File | Mode | Read when |
|------|------|-----------|
| `references/interrogation-protocol.md` | Create | Starting Create Step 2: question decision tree, recommended-answer format, fuzzy term patterns, anti-rationalization table |
| `references/doc-grounding.md` | Create | Create Step 1, when design docs, RFCs, ADRs, or library/API docs are relevant: how to find them, extract the decisions they encode, and grill the rationale |
| `references/html-question-form.md` | Create | Create Step 2, optional: generating a batched HTML question form for large or greenfield specs instead of one-at-a-time chat |
| `references/plan-quality-rubric.md` | Review | Review Step 2 triage: 1-5 scoring criteria per dimension |
| `references/questioning-framework.md` | Review | Review Step 3: question templates and pushback patterns per dimension |
| `references/dialogue-examples.md` | Review | Before the Review dialogue: tone calibration and all four moves in action |
| `references/claim-verification.md` | Review | Whenever a claim is checkable against local code, docs, or specs, or the user asks to verify a claim |

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

Before asking anything, scan both code and docs:

- Identify the modules, files, and patterns that relate to the request; note existing conventions, abstractions, and boundaries; look for prior art.
- Read relevant documentation: design docs, RFCs, ADRs, READMEs, plus referenced library/API docs and any spec the user points to. Load `references/doc-grounding.md` for how to find docs and extract the decisions and rationale they encode.

State what you found in 2-3 sentences before the first question. This grounds the interrogation in reality.

### Step 2: Interrogate

Load `references/interrogation-protocol.md`. Ask ONE question at a time. Every question carries a **recommended answer** grounded in what Step 1 found: name the file, the function, the approach.

- If a question is answerable by reading code or docs, answer it yourself and move on; never spend a user question on it.
- One question at a time: each answer shapes the next. Walk the decision tree: resolve intent and scope before approach, approach before risks.
- Flag fuzzy terms ("handle auth", "make it fast"): propose a sharp version and ask if it is right.
- Surface tensions with existing code: "The codebase does X. You're proposing Y. Which wins?"
- **Grill the core decisions:** when docs reveal a decision, interrogate *why* it was made and whether the rationale still holds. Never re-ask what the docs already answer; pressure-test the reasoning.

**Budget:** 5-10 questions, then synthesize.

**Mandatory scope challenge (ask before synthesizing):** ask "What can we cut without dropping a current requirement?" Look for scope to cut, decisions that collapse into one, unearned abstractions, and horizontal layers that can become one executable slice. Carry a recommended answer. This challenges the *sum* of the plan, not each piece.

**Batch mode (optional):** for large or greenfield specs with many independent questions, generate a single local HTML form. Load `references/html-question-form.md` for the template and the batch-vs-sequential decision table. Keep one-at-a-time as the default whenever answers should shape later questions.

**Escape hatch:** if the user says "just write the plan", push back once using the anti-rationalization table, then respect their call and skip to Step 3.

### Step 3: Synthesize

Write the plan file to `~/.claude/plans/`. Match the format to the scope.

**Lightweight** (single file, clear approach): `# Title`, `## Context` (one paragraph), `## Approach`.

**Standard** (multiple files, decisions made): `# Title`, `## Context` (problem, what prompted it, intended outcome), `## Approach` (recommended approach only), `## Key decisions` (with brief rationale), `## Files to modify` (grouped by purpose), `## Out of scope` (related-looking things that must not change, each with a reason), `## Verification` (each item a command plus its expected result).

Keep plans concise enough to scan, detailed enough to execute without re-reading the conversation. Record only the chosen approach; rejected alternatives belong in Key decisions as one-line rationale.

**Handoff plans:** when a different agent or session will execute the plan, the executor has not seen this conversation. Inline any code excerpts and conventions it needs (with `file:line` markers), and add a **STOP conditions** section: assumptions that, if false, mean stop and report back rather than improvise.

### Step 4: Validate

- Does the plan answer the user's original request?
- Did every interrogation answer land in the plan? An answer that never made it in was a wasted question.
- **Scope gate:** if any scope, decision, or abstraction can be cut or deferred without dropping a current requirement, cut it now. The plan does not pass until this is true.
- Are there unstated assumptions that should be explicit?

Fix failures in the plan directly; don't reopen the interrogation. Report the plan file path and a one-line confirmation that each check passed.

### Step 5: Hand off

Offer Review mode: "Plan written to `<path>`. Stress-test it to 5/5 before implementation?"

## Review mode

**Objective:** drive all six dimensions to **5/5**. Work each sub-5 dimension upward, re-scoring after each round, until every dimension is 5/5 or provably stalled on a decision only the user can make.

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

If the user provides a path, read it. If not, list `~/.claude/plans/` by modification time, pick the most recent, and confirm. Read the full plan; note the stated goal, structure, and length. If the document is a diff or code rather than a plan, stop and route to `pr-reviewer`.

### Step 2: Triage

Load `references/plan-quality-rubric.md`. Do a silent pass across the six dimensions, scoring each 1-5. While scoring, mark every claim checkable against local code, docs, or specs; verify the load-bearing ones now (load `references/claim-verification.md`) and fold the verdicts into the scores. Never spend a dialogue turn on something the codebase can answer.

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

State: "I'll work each dimension up to 5/5, starting with the weakest." If more than 3 dimensions start at 1-2, the plan needs rewriting, not review: say so and switch to Create mode rather than grinding the loop.

### Step 3: Rubber duck loop

Load `references/questioning-framework.md` and `references/dialogue-examples.md`. Each round:

1. Pick the lowest-scoring dimension still below 5.
2. Ask ONE question that quotes or names a specific section, claim, or omission. Never bundle two questions.
3. On the answer, choose exactly one move:

- **VERIFY:** the answer (or the plan text it defends) is checkable with local evidence. Load `references/claim-verification.md`, gather evidence, quote the authoritative doc, return VERIFIED / NOT VERIFIED / INCONCLUSIVE, then continue informed. Prefer VERIFY over asking whenever evidence can settle the point.
- **PUSH DEEPER:** the answer hand-waves complexity. Ask a sharper follow-up. Maximum 2 pushes per question.
- **ACCEPT AND RECORD:** the answer closes the gap. Write the resolution into the plan file immediately, then re-score the dimension.
- **REFRAME:** the concern does not apply as framed. Acknowledge what the user got right, then redirect to the actual gap.

Stay on the same dimension until it reaches 5/5 or stalls, then move to the next-lowest below 5.

**Stall rule:** after 2 pushes without a 5/5-grade answer, propose a concrete fix to accept or reject. If accepted, write it in and re-score. If the user defers, record exactly what blocks 5/5 and move on. This is the only stall procedure; do not keep re-asking in different words.

### Step 4: Re-score and repeat

After each dimension closes or stalls, re-render the triage table so the climb is visible. Sweep again over any dimension still below 5. The loop ends when all six are 5/5, the user invokes the escape hatch, or a full sweep produces no progress (summarize what blocks 5/5 and stop).

### Step 5: Gap summary

Lead with the final triage table (before and after). Then list residual gaps in three tiers; if every dimension reached 5/5, say so and leave "Must address" empty.

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

Plan edits happen incrementally during the loop. This final pass confirms the file is the deliverable: every resolution inline where its gap was identified; every stalled dimension carries a `<!-- UNRESOLVED: what blocks 5/5 -->` comment; a Review Notes section appended with before/after triage scores and the date. Do not ask permission to edit; updating the plan is the point. If the plan arrived as pasted text with no file, output the full updated plan in a code block and offer to write it to `~/.claude/plans/`.

### Review dialogue protocol

- Quote the plan's own words when challenging them; paraphrase invites "that's not what I meant" detours.
- No "great plan, but...": start with the triage table and go straight to gaps. Acknowledge strengths in one clause at most.
- Direct but constructive; the goal is strengthening, not criticism.
- Name scope creep, unearned abstractions, and horizontal-layer plans explicitly. Push for the minimum executable slice that proves the approach end-to-end.

## Gotchas

- Don't ask a question the codebase or docs already answer; the user notices, loses trust, and starts rubber-stamping. Explore and verify first, in both modes.
- In Create, don't re-ask what a doc plainly states; grill the *why* behind the decision.
- In Create, don't pose a question without a recommended answer; a bare question hands the blank page back to the user, the exact failure this skill prevents.
- Don't batch questions outside explicit HTML batch mode; answers can no longer shape follow-ups.
- Don't write code or start implementing; the deliverable is the plan file.
- In Create, don't turn adversarial; that is Review mode. Propose, let the user react, refine.
- In Review, don't bundle two questions into one turn, and don't push a third time on the same question; invoke the stall rule instead.
- In Review, don't defer plan edits to the end; write each resolution the moment it closes. Don't ask permission to edit; the user can revert.
- In Review, don't skip the re-rendered triage table after each dimension; without it, stalls and progress look identical.
- Don't exceed 10 questions in Create; past that the scope is too large for one plan. Propose a split.
- Don't write "verify it works" as a verification step; pair every check with its command and expected result.

## Related skills

Pipeline: `planning` -> implementation -> `pr-reviewer` -> `pr-creator` -> `pr-babysitter`.

- `pr-reviewer`: code review after implementation; route here the moment the input is code, not a plan.
- `pr-creator`: opens the PR once the plan is implemented.
- `define-architecture`: architectural decisions that feed into plans.
