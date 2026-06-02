---
name: plan-creator
description: Collaborative interrogation that produces an implementation plan. Reads relevant docs and code first, asks one question at a time with a recommended answer, grills the core decisions, flags fuzzy terminology, and walks the decision tree until shared understanding is reached. Outputs a plan file. Use when asked to "create a plan", "help me think through this", "plan this feature", "I want to build X", "grill me", "grill with docs", "understand the docs", "unpack the decisions", "brainstorm a spec", "what should the plan be", "think this through with me", or before starting any non-trivial implementation.
---

# Plan Creator

Build a plan through collaborative interrogation before coding starts.

- **IS:** A dialogue partner that asks sharp questions, suggests answers, explores the codebase, and synthesizes a plan file
- **IS NOT:** A plan reviewer (use `plan-reviewer`), a code generator, or a PRD template

## Core lens

Every question and recommendation filters through these principles (ordered by priority):

1. **KISS** — Is this the simplest thing that could work?
2. **YAGNI** — Is every piece justified by a current requirement?
3. **Tracer bullet** — Does the plan deliver a minimal working slice across the full stack first?
4. **Small functions** — Are responsibilities clearly separated?
5. **Easier to change** — Does the design isolate concerns so future changes are local?

## Reference files

| File | Read when |
|------|-----------|
| `references/interrogation-protocol.md` | Starting Step 2: question decision tree, answer format, fuzzy term patterns, anti-rationalization |
| `references/doc-grounding.md` | Step 1, when design docs, RFCs, ADRs, or library/API docs are relevant: how to find them, extract core decisions, and grill the rationale |
| `references/html-question-form.md` | Step 2, optional: generating a batched HTML question form for large or greenfield specs instead of one-at-a-time chat |

## Workflow

```text
Plan creation progress:
- [ ] Step 1: Understand intent — read the request, scan the codebase
- [ ] Step 2: Interrogate — one question at a time, recommend answers
- [ ] Step 3: Synthesize — write the plan file
- [ ] Step 4: Validate — check plan answers the original request
- [ ] Step 5: Hand off — offer plan-reviewer
```

### Step 1: Understand intent

Before asking anything, scan both the code **and the docs** for relevant context:

- Identify the modules, files, and patterns that relate to the request
- Note existing conventions, abstractions, and boundaries
- Look for prior art — has something similar been built before?
- Read relevant documentation — design docs, RFCs, ADRs, READMEs in the repo, plus the referenced library/API docs and any spec the user points to. Load `references/doc-grounding.md` for how to find docs, extract the core decisions they encode, and the rationale behind them.

State what you found in 2-3 sentences. This grounds the interrogation in reality.

### Step 2: Interrogate

Load `references/interrogation-protocol.md`. Ask ONE question at a time. For every question, provide a **recommended answer** based on what you found in the codebase.

Key rules:
- If a question is answerable by reading code or docs, answer it yourself and move on
- One question at a time — each answer shapes the next question
- Walk the decision tree — resolve foundations before dependencies
- Flag fuzzy terms — propose a sharp version, ask if it's right
- Surface tensions with existing code — "The codebase does X. You're proposing Y."
- **Grill the core decisions** — when the docs reveal a decision (a chosen approach, a constraint, a tradeoff), interrogate *why* it was made and whether it still holds for this work. Don't re-ask what the docs already answer; pressure-test the rationale instead.

**Budget:** 5-10 questions, then synthesize.

**Batch mode (optional):** For large or greenfield specs with many independent questions, you may generate a single local HTML form the user fills in at once instead of asking one-at-a-time. Load `references/html-question-form.md` for the template and when to use it. Keep the one-at-a-time default for anything where each answer should shape the next question.

**Escape hatch:** If the user says "just write the plan" or "enough questions", skip to Step 3.

### Step 3: Synthesize

Write the plan file to `~/.claude/plans/`. Adapt the format to the scope:

**Lightweight changes** (single file, clear approach):
```markdown
# [Title]

## Context
[Why this change — one paragraph]

## Approach
[What to do]
```

**Standard changes** (multiple files, decisions made):
```markdown
# [Title]

## Context
[Why this change — the problem, what prompted it, intended outcome]

## Approach
[What to do — the recommended approach only]

## Key decisions
[Decisions from interrogation with brief rationale]

## Files to modify
[Critical files, grouped by purpose]

## Verification
[How to test end-to-end]
```

Keep plans concise enough to scan quickly, detailed enough to execute without re-reading the conversation.

### Step 4: Validate

Before handing off, silently check:
- Does the plan answer the user's original request?
- Were any interrogation questions left dangling without resolution?
- Does the approach align with the core lens (KISS, YAGNI, tracer bullet)?
- Are there unstated assumptions that should be made explicit?

If anything fails, fix it in the plan. Don't ask the user — just fix it.

### Step 5: Hand off

After writing the plan, offer: "Plan written. Run `plan-reviewer` to stress-test it before implementation?"

## Gotchas

- Don't ask questions you can answer by reading the codebase or the docs. The whole point is that you explore first.
- Don't re-ask what the docs already answer — grill the *why* behind a decision, not the *what*.
- Don't ask all questions upfront. Walk the tree — each answer shapes the next question.
- Don't skip the recommended answer. That's the key differentiator — the user reacts to a concrete suggestion instead of staring at a blank page.
- Don't write code. This produces a plan, not an implementation.
- Don't be adversarial. That's `plan-reviewer`. This skill is collaborative.
- Don't exceed 10 questions. If the plan needs more, the scope is too large — suggest splitting.
- Don't ask "is there anything else?" Synthesize what you have.
- Don't use the full plan template for trivial changes. Match format to scope.

## Related skills

- `plan-reviewer` — adversarial review of the plan after creation
- `define-architecture` — architectural decisions that feed into plans
