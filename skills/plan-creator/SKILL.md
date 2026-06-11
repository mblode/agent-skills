---
name: plan-creator
description: Collaborative interrogation that produces an implementation plan before any code is written. Explores the codebase and relevant docs first, asks one question at a time with a concrete recommended answer, grills the rationale behind documented decisions, flags fuzzy terminology, and walks a decision tree until shared understanding is reached, then writes a plan file. First step of the shipping pipeline; it creates plans, plan-reviewer stress-tests them, pr-creator opens the PR. Use when asked to "create a plan", "help me think through this", "plan this feature", "I want to build X", "grill me", "grill with docs", "understand the docs", "unpack the decisions", "brainstorm a spec", "what should the plan be", "think this through with me", or before starting any non-trivial implementation.
---

# Plan Creator

Build a plan through collaborative interrogation before coding starts.

- **IS:** A dialogue partner that explores the codebase first, asks sharp questions one at a time with recommended answers, and synthesizes a plan file
- **IS NOT:** A reviewer or stress-tester of an existing plan (use `plan-reviewer`), an implementer or code generator, or a PR author (use `pr-creator`)

Pipeline position: `plan-creator` → `plan-reviewer` → implementation → `pr-reviewer` → `pr-creator` → `pr-babysitter`. This skill is the first stop; everything downstream assumes the plan file it produces.

## Core lens

Every question and recommendation filters through these principles (ordered by priority):

1. **KISS:** Is this the simplest thing that could work?
2. **YAGNI:** Is every piece justified by a current requirement?
3. **Tracer bullet:** Does the plan deliver a minimal working slice across the full stack first?
4. **Small functions:** Are responsibilities clearly separated?
5. **Easier to change:** Does the design isolate concerns so future changes are local?

## Reference files

| File | Read when |
|------|-----------|
| `references/interrogation-protocol.md` | Starting Step 2: question decision tree, recommended-answer format, fuzzy term patterns, anti-rationalization table |
| `references/doc-grounding.md` | Step 1, when design docs, RFCs, ADRs, or library/API docs are relevant: how to find them, extract the decisions they encode, and grill the rationale |
| `references/html-question-form.md` | Step 2, optional: generating a batched HTML question form for large or greenfield specs instead of one-at-a-time chat |

## Workflow

```text
Plan creation progress:
- [ ] Step 1: Understand intent (read the request, scan code and docs, state findings)
- [ ] Step 2: Interrogate (one question at a time, each with a recommended answer)
- [ ] Step 3: Synthesize (write the plan file, format matched to scope)
- [ ] Step 4: Validate (check the plan against the original request, report the path)
- [ ] Step 5: Hand off (offer plan-reviewer)
```

### Step 1: Understand intent

Before asking the user anything, scan both the code and the docs:

- Identify the modules, files, and patterns that relate to the request
- Note existing conventions, abstractions, and boundaries
- Look for prior art: has something similar been built here before?
- Read relevant documentation: design docs, RFCs, ADRs, and READMEs in the repo, plus referenced library/API docs and any spec the user points to. Load `references/doc-grounding.md` for how to find docs, extract the decisions they encode, and the rationale behind them.

State what you found in 2-3 sentences before the first question. This grounds the interrogation in reality and shows the user you did the homework.

### Step 2: Interrogate

Load `references/interrogation-protocol.md`. Ask ONE question at a time. Every question carries a **recommended answer** grounded in what Step 1 found: name the file, the function, the approach.

Key rules:

- If a question is answerable by reading code or docs, answer it yourself and move on; never spend a user question on it
- One question at a time: each answer shapes the next question
- Walk the decision tree in the protocol: resolve intent and scope before approach, approach before risks
- Flag fuzzy terms ("handle auth", "make it fast"): propose a sharp version and ask if it is right, instead of asking what they meant
- Surface tensions with existing code: "The codebase does X. You're proposing Y. Which wins?"
- **Grill the core decisions:** when docs reveal a decision (a chosen approach, a constraint, a rejected alternative), interrogate *why* it was made and whether the rationale still holds for this work. Never re-ask what the docs already answer; pressure-test the reasoning instead.

**Budget:** 5-10 questions, then synthesize.

**Batch mode (optional):** For large or greenfield specs with many independent questions, generate a single local HTML form the user fills in at once. Load `references/html-question-form.md` for the template and the batch-vs-sequential decision table. Keep one-at-a-time as the default whenever answers should shape later questions.

**Escape hatch:** If the user says "just write the plan" or "enough questions", push back once using the anti-rationalization table, then respect their call and skip to Step 3.

### Step 3: Synthesize

Write the plan file to `~/.claude/plans/`. Match the format to the scope:

**Lightweight changes** (single file, clear approach):

```markdown
# [Title]

## Context
[Why this change, one paragraph]

## Approach
[What to do]
```

**Standard changes** (multiple files, decisions made):

```markdown
# [Title]

## Context
[Why this change: the problem, what prompted it, intended outcome]

## Approach
[What to do, the recommended approach only]

## Key decisions
[Decisions from interrogation with brief rationale]

## Files to modify
[Critical files, grouped by purpose]

## Out of scope
[Files or behaviors that look related but must not change, each with a one-line reason]

## Verification
[How to test end-to-end: each item is a command plus its expected result, so success is never a judgment call]
```

Keep plans concise enough to scan quickly, detailed enough to execute without re-reading the conversation. Record only the chosen approach; rejected alternatives belong in Key decisions as one-line rationale, not as parallel options.

**Handoff plans:** when the plan will be executed by a different agent or session (captain, cmux, handoff), the executor has not seen this conversation. Inline any code excerpts and conventions it needs (with `file:line` markers), and add a **STOP conditions** section: assumptions that, if false, mean stop and report back rather than improvise.

### Step 4: Validate

Before handing off, check:

- Does the plan answer the user's original request?
- Did every interrogation answer land in the plan? An answer that never made it in was a wasted question.
- Does the approach pass the core lens (KISS, YAGNI, tracer bullet)?
- Are there unstated assumptions that should be explicit?

If anything fails, fix it in the plan directly; don't reopen the interrogation. Then report the evidence: the plan file path and a one-line confirmation that each check passed.

### Step 5: Hand off

Offer the next pipeline stage: "Plan written to `<path>`. Run `plan-reviewer` to stress-test it before implementation?"

## Gotchas

- Don't ask a question the codebase or docs already answer; the user notices, loses trust in the interrogation, and starts rubber-stamping answers. Explore first.
- Don't re-ask what a doc plainly states; grill the *why* behind the decision. Re-asking the *what* signals Step 1 was skipped.
- Don't batch questions into one message outside explicit HTML batch mode; answers can no longer shape follow-ups, so you end up planning against guesses.
- Don't pose a question without a recommended answer; a bare question hands the blank page back to the user, which is the exact failure this skill exists to prevent.
- Don't write code or start implementing; the deliverable is the plan file in `~/.claude/plans/`, nothing else. Implementation happens after `plan-reviewer`.
- Don't turn adversarial ("that won't work because..."); stress-testing is `plan-reviewer`'s job. Here you propose, the user reacts, you refine.
- Don't exceed 10 questions; past that, the scope is too large for one plan. Say so and propose a split instead of question 11.
- Don't close with "anything else?"; it invites noise answers that bloat the plan. Synthesize what you have.
- Don't write "verify it works" as a verification step; pair every check with the command to run and its expected result, so the executor never judges success by feel.
- Don't use the standard template for a trivial one-file change; a heavyweight plan buries the one instruction that matters.

## Related skills

Pipeline order: `plan-creator` → `plan-reviewer` → implementation → `pr-reviewer` → `pr-creator` → `pr-babysitter`.

- `plan-reviewer`: adversarial review of the plan this skill produces; always offer it at hand-off
- `define-architecture`: architectural decisions that feed into plans
