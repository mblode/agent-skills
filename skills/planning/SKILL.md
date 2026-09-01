---
name: planning
description: >-
  Builds and stress-tests implementation plans before any code. Create mode
  scans code and docs, asks one grounded question at a time with a recommended
  answer, challenges scope, and writes a plan file a fresh session can
  execute. Review mode scores completeness, feasibility, scope, testability,
  risk, and assumptions, verifies checkable claims against the repo, and
  writes resolutions back until every dimension reaches 5/5. Splits big work
  into vertical-slice tickets. Works inside Claude Code plan mode. Use when
  asked to "create a plan", "plan this feature", "write a spec", "grill me",
  "interview me", "think this through", "blindspot pass", "unknown unknowns",
  "review my plan", "rubber duck this", "stress test this plan", "get this
  plan to 5/5", "what am I missing", "verify this claim", "write a brief
  another agent can execute", or "split this into tickets". For code review
  use pr-reviewer; for architecture briefs use codebase-architecture; for a
  new repo use scaffold-nextjs or scaffold-cli.
---

# Planning

Build the plan by interrogation, then stress-test it adversarially, before coding. The deliverable is a plan file, or the tickets it splits into when the work is too big for one pass. Never code.

- **IS:** building a plan from intent through one-question-at-a-time interrogation (Create), strengthening an existing plan by scoring six dimensions to 5/5 with claim verification (Review), and splitting oversized work into vertical-slice tickets (`references/splitting.md`). Both modes write to the plan file.
- **IS NOT:** implementing or generating code, authoring a PR (`pr-creator`), reviewing a code diff (`pr-reviewer`), simplifying a diff (`tidy`), writing an architecture brief or ADR (`codebase-architecture`), or scaffolding a repo (`scaffold-nextjs`, `scaffold-cli`).

Pipeline position: `planning` (create, then review) -> implementation -> `pr-reviewer` -> `pr-creator` -> `pr-babysitter`.

## Fit inside plan mode, not beside it

Claude Code's plan mode (`Shift+Tab`, a `/plan` prefix, or `claude --permission-mode plan`) already blocks source edits, writes the plan to `~/.claude/plans/<name>.md` (or `plansDirectory`), lets the user edit it with `Ctrl+G`, and presents it for approval through `ExitPlanMode`. This skill supplies what plan mode does not: the questions, the scope challenge, the scoring, and the file's contents.

- The plan file is the one plan mode opened. Write a second copy only when the plan must outlive the session or be read by another checkout, at the path project instructions name (default `docs/plans/<slug>.md`), and say so in the chat.
- Run Review before `ExitPlanMode`, so the approval screen shows the reviewed plan. The harness prompt is the approval gate; add none of your own.
- Approval can clear the planning context (`showClearContextOnPlanAccept`) or start a fresh session, so every plan is read by an executor who never saw this conversation. Write for that reader.
- Ask Create-mode questions through `AskUserQuestion`: the recommended answer is the first option, labelled as recommended, with the evidence (file, function, precedent) in its description. Review questions quote plan text and take free-text answers in chat. Auto mode honors questions a skill relies on.
- Outside Claude Code (Codex, Cursor, an API session) the protocol is the same; the plan goes where the user or project instructions say.

Skip the plan when the diff fits in one sentence (a typo, a log line, a rename): say so and let the user proceed.

## Mode dispatch

Auto-detect; ask only if genuinely ambiguous:

- **No plan in scope**, or verbs like "create a plan", "plan this", "grill me", "think this through" -> **Create mode**.
- **Existing plan in scope** (a path, pasted text, or the most recent file in the plans directory), or verbs like "review my plan", "stress test", "is this ready", "get this to 5/5", "fact-check this plan" -> **Review mode**.
- **A standalone claim to verify**, no plan -> answer with local evidence per `references/claim-verification.md`; create no plan file.
- **Code or a diff** rather than a plan -> stop and route to `pr-reviewer`.

Create hands off to Review; a plan is not ready for implementation until Review passes.

## Decision principles

Use these to cut scope, sequence work, and challenge the plan. Each one becomes a plan edit, never a slogan in the text.

1. **KISS:** the fewest moving parts that satisfy the current requirement.
2. **As simple as possible, no simpler:** never cut correctness, permissions, observability, rollback, migration safety, or required edge states.
3. **YAGNI:** defer extension points, future providers, and speculative settings until a named current requirement needs them.
4. **Proven practice:** when the repo or ecosystem has a pattern for this exact problem, use it and name the precedent.
5. **Easier to change:** name what file, module, table, or boundary the next likely requirement touches, and what stays untouched.
6. **Tracer bullet:** one minimum vertical slice across the real boundary before any horizontal layer.
7. **DRY:** deduplicate knowledge, invariants, and business rules, not coincidental shape.
8. **Duplication over wrong abstraction:** keep similar code apart when a shared abstraction would hide different rules, lifecycles, owners, or failure modes.
9. **Ladder of least code:** for each piece of new code, take the first rung that holds: existing code in the repo, stdlib, a native platform feature, an already-installed dependency, then minimum new code. A step that adds a dependency or new code a higher rung covers must say why the higher rungs fail.

Conflict rule: current requirements win. Then principle 2 bounds KISS and YAGNI; principle 8 bounds DRY; the tracer bullet beats foundation work unless the project cannot run without that foundation.

## Reference files

| File | Mode | Read when |
|------|------|-----------|
| `references/interrogation-protocol.md` | Create | Create Step 2: question decision tree, blindspot pass, reference-as-spec, recommended-answer format, fuzzy-term table, anti-rationalization table |
| `references/doc-grounding.md` | Create | Create Step 1, when design docs, RFCs, ADRs, or library docs bear on the work: find them, extract the decisions they encode, grill the rationale |
| `references/handoff-plans.md` | Create | Create Step 3, when a fresh session, subagent, or teammate will execute: inline context, STOP conditions, finish line, implementation-notes file |
| `references/plan-quality-rubric.md` | Review | Review Step 2: 1-5 scoring criteria per dimension |
| `references/questioning-framework.md` | Review | Review Step 3: question templates and pushback patterns per dimension |
| `references/claim-verification.md` | Both | A claim is checkable against local code, docs, or specs, or the user asks to verify one; includes the worked Verify move |
| `references/splitting.md` | Both | The work exceeds one plan: vertical-slice rules, blocking edges, expand-contract, granularity confirmation, publishing tickets |

## Create mode

```text
Create progress:
- [ ] Step 1: Understand intent (read the request, scan code and docs, state findings)
- [ ] Step 2: Interrogate (one question at a time; end with the scope challenge)
- [ ] Step 3: Synthesize (write the plan file, format matched to scope)
- [ ] Step 4: Validate (four checks, emit the validation block)
- [ ] Step 5: Hand off to Review mode
```

### Step 1: Understand intent

Before asking anything, scan: modules, files, and patterns related to the request; conventions, boundaries, and prior art; design docs, RFCs, ADRs, READMEs, and any spec the user points to (`references/doc-grounding.md`). Delegate a wide scan to the Plan subagent so file contents stay out of the main context. State findings in 2-3 sentences before the first question.

### Step 2: Interrogate

Load `references/interrogation-protocol.md`. One question at a time, each carrying a recommended answer grounded in Step 1 (file, function, approach).

- **Diverge first:** open with 2-3 genuinely different framings of the work, each with what it buys and forecloses, then recommend one. This is the only turn where the frame is still open, and it catches the two scope errors nothing later can: too narrow (a one-line fix where the bug class needed handling) and too wide (a framework where one function held).
- If code or docs can answer it, answer it yourself. A question the repo answers spends budget and returns what Step 1 read for free.
- Walk the decision tree: intent and scope before approach, approach before risks. Sharpen fuzzy terms by proposing the sharp version.
- Surface tensions with existing code: "The codebase does X. You're proposing Y. Which wins?" When docs reveal a decision, grill the rationale, not the choice.
- **Reference-as-spec:** ask whether existing code, a library, a design, or a site already does this the way the user wants. If so, read it, treat its semantics as the spec, and interrogate only deviations.
- **Blindspot pass** (when the user is new to the area or asks for one): pause to surface what good looks like, prior art, and potholes, teach it back in cited bullets, then resume.
- **Batch only independent questions:** several questions in one `AskUserQuestion` call when no answer changes the next question (greenfield specs). Default to one at a time whenever answers branch.

**Budget:** 5-10 questions, then synthesize. Needing more than 10 means the scope exceeds one plan: propose a split via `references/splitting.md` instead of asking an eleventh. A split redirects Step 3: the deliverable becomes approved tickets indexed by a `## Slices` section in a lightweight plan file. Steps 4 and 5 still run on that file.

**Scope challenge (last question, always):** "What can we cut without dropping a current requirement?" Bring a recommended cut list: removed extension points, setup collapsed into the first vertical slice, code or dependencies a higher ladder rung covers, abstractions kept only where they protect a shared invariant or owner, and safety gates preserved where "simpler" would drop correctness. Challenge the sum of the plan, not each piece.

**Escape hatch:** if the user says "just write the plan", push back once with the anti-rationalization table, then respect the call and go to Step 3.

### Step 3: Synthesize

Write the plan file (see the plan-mode section for where). Match format to scope and drop any section the task does not need; a plan that restates the codebase or explains decisions the reader already made buries the parts that need a second look.

**Lightweight** (single file, clear approach): `# Title`, `## Context` (one paragraph), `## Approach`.

**Standard** (multiple files, decisions made): `# Title`, `## Context` (problem, trigger, intended outcome), `## Approach` (chosen only), `## Key decisions` (one-line rationale each; rejected alternatives live here), `## Files to modify` (grouped by purpose; a pattern plus three representative paths beats an exhaustive list), `## Out of scope` (related-looking things that must not change, each with a reason), `## Verification` (each item a command plus its expected result).

**Volatile first:** within Approach, Key decisions, and Files to modify, lead with what the user is most likely to tweak (data model, new interfaces, user-facing flows) and sink mechanical detail to the bottom, so a reviewer can stop reading once the tweakable decisions look right.

**Handoff plans:** when a fresh session, subagent, or teammate executes, load `references/handoff-plans.md` and add its STOP conditions, finish line, and implementation-notes file. In plan mode with clear-context-on-accept, that is every plan.

### Step 4: Validate

- Does the plan answer the original request?
- Did every interrogation answer land in the plan? An answer that never made it in was a wasted question.
- **Scope gate:** the plan fails on any decision-principle violation, especially an unneeded extension point, horizontal setup before the first tracer bullet, new code or a dependency where a higher ladder rung holds, or a cut that drops required correctness, permissions, rollback, migration safety, or edge states.
- Any unstated assumption that should be explicit?

Fix failures in the file directly; don't reopen the interrogation. Then emit the block. Every row cites the plan section that satisfies it; a row with nothing to cite is a failure to fix, not a claim to assert:

```text
PLAN VALIDATION: <path>
  Answers the request    <section stating the intended outcome>
  Answers landed         <n of n interrogation answers; name any dropped>
  Scope gate             <section carrying the cut list; principles checked>
  Assumptions explicit   <section, or "none found">
  Verification           <the plan's Verification commands, copied>
```

Lightweight plans have no Verification section; cite the one check that proves the approach.

### Step 5: Hand off

"Plan written to `<path>`. Stress-test it to 5/5 before implementation?" In plan mode, run Review on yes and only then call `ExitPlanMode`.

## Review mode

**Objective:** all six dimensions at **5/5**, or provably stalled on a decision only the user can make.

```text
Review progress:
- [ ] Step 1: Load the plan
- [ ] Step 2: Triage: verify checkable claims, score all six dimensions
- [ ] Step 3: Rubber duck loop: drive each dimension <5 to 5/5 (max 2 pushes per question)
- [ ] Step 4: Re-score after each dimension; repeat until all 5/5 or stalled
- [ ] Step 5: Gap summary (before/after scores plus residual blockers)
- [ ] Step 6: Confirm the plan file holds every resolution and unresolved annotation
```

### Step 1: Load the plan

Read the path the user gives; otherwise list the plans directory by modification time, pick the most recent, and confirm. Note goal, structure, length. A diff or code routes to `pr-reviewer`.

### Step 2: Triage

Load `references/plan-quality-rubric.md`. Score each dimension 1-5 silently. Mark every claim checkable against local code, docs, or specs; verify the load-bearing ones now (`references/claim-verification.md`) and fold verdicts into the scores. A NOT VERIFIED claim drops its dimension a point and becomes the first question.

```
PLAN TRIAGE:
  Completeness    ███░░  3/5  Missing error handling, no rollback
  Feasibility     ████░  4/5  One unproven dependency
  Scope           ██░░░  2/5  Premature abstractions
  Testability     █░░░░  1/5  No verification strategy
  Risk            ███░░  3/5  Blast radius unclear
  Assumptions     ██░░░  2/5  Three unstated assumptions
```

Then: "I'll work each dimension up to 5/5, starting with the weakest." More than 3 dimensions at 1-2 means the plan needs rewriting, not review: switch to Create mode. Scope stuck below 5 because the plan carries two shippable outcomes means two plans: split via `references/splitting.md`.

### Step 3: Rubber duck loop

Load `references/questioning-framework.md`. Each round:

1. Pick the lowest dimension still below 5.
2. Ask one question that quotes a specific section, claim, or omission.
3. On the answer, choose exactly one move:

- **VERIFY:** the answer or the plan text is checkable locally. Gather evidence, quote the source, return VERIFIED / NOT VERIFIED / INCONCLUSIVE, continue informed. Prefer this over asking whenever evidence can settle it.
- **PUSH DEEPER:** the answer hand-waves. Ask a sharper follow-up. Max 2 pushes per question.
- **ACCEPT AND RECORD:** the gap closes. Write the resolution into the plan file immediately, re-score.
- **REFRAME:** the concern does not apply as framed. Acknowledge what the user got right, redirect to the actual gap.

**Stall rule:** after 2 pushes without a 5/5 answer, propose a concrete fix to accept or reject. Accepted: write it in, re-score. Deferred: record what blocks 5/5, move to the next dimension. Re-asking in different words never produces the answer.

### Step 4: Re-score and repeat

After each dimension closes or stalls, re-render the triage table so the climb is visible. Sweep again over anything below 5. Stop when all six are 5/5, the user invokes the escape hatch, or a full sweep makes no progress.

### Step 5: Gap summary

Lead with the before and after triage tables. Then residual gaps in three tiers; if every dimension reached 5/5, say so and leave "Must address" empty.

```markdown
## Plan Review

### Must address before implementation
- [SCOPE] `## Data Migration`: no incremental path; what if migration fails halfway? Resolved: NO

### Should address soon
- [ASSUMPTION] Assumes API rate limits hold at projected scale. Resolved: YES (80/min confirmed against a 100/min limit)

### Noted for awareness
- [RISK] Single third-party dependency with no fallback. Resolved: NO
```

### Step 6: Confirm the plan file

Edits happened during the loop; this pass confirms the file is the deliverable: every resolution inline where its gap was found, every stalled dimension carrying a `<!-- UNRESOLVED: what blocks 5/5 -->` comment, and a `## Review notes` section with the before/after scores and date. Updating the plan is the point, so do not ask permission. A plan that arrived as pasted text has no file: output the full updated plan in a code block and offer to write it to the plans directory or a path the user names.

### Review dialogue protocol

- Quote the plan's words when challenging; paraphrase invites "that's not what I meant" detours.
- Start with the triage table and go straight to gaps; acknowledge strengths in one clause at most.
- Name scope creep, unearned abstractions, and horizontal-layer plans explicitly. Push for the minimum executable slice that proves the approach end-to-end.

## Gotchas

- Approving a plan with the clear-context option leaves the executor holding only the file. "As discussed" or "the approach we agreed on" in the plan points at a conversation that no longer exists; every decision must be stated in the file.
- `~/.claude/plans/` is outside the repo: nothing there is committed, visible to a second worktree, or read by CI. A plan a teammate or a later session must pick up needs a copy at the repo path, and the chat must say which file is authoritative.
- In plan mode, commands outside the read-only set prompt or go to the classifier. A VERIFY move that reaches for `npm test` or a full build stalls on a permission prompt mid-dialogue; settle claims with `grep`, `git log`, and file reads first, and run the suite only for a load-bearing claim.
- A `## Verification` line of bare `npm test` passes green when the executor writes no tests. Each line names the test, command, or observation and its expected result, so a missing test is a visible failure.
- Driving Completeness to 5/5 by adding error handling for cases that cannot occur is the padding the review exists to catch. A Completeness point bought with a Scope point is a regression; the rubric's 5/5 is specifics, not coverage of hypotheticals.
- A split that names slices without publishing them leaves the work exactly where it was, in prose. The deliverable is tickets a human approved and an agent can pick up, each declaring its blockers.
- Blocking edges written only in a ticket's prose are invisible to whatever picks the tickets up. Use the tracker's native relation, and only for real dependencies: one decorative edge parks a ticket that could have started, silently.

## Related skills

- `pr-reviewer`: reviews the implemented diff, including against the plan file; route here the moment the input is code, not a plan.
- `tidy`: applies simplifications to a diff; the scope challenge is the same instinct applied before the code exists.
- `pr-creator`: opens the PR once the plan is implemented.
- `codebase-architecture`: architecture briefs and ADRs that a plan cites under Key decisions.
