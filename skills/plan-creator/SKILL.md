---
name: plan-creator
description: Collaborative interrogation that produces an implementation plan. Asks one question at a time with a recommended answer, explores the codebase before asking the user, flags fuzzy terminology, and walks the decision tree until shared understanding is reached. Outputs a plan file. Use when asked to "create a plan", "help me think through this", "plan this feature", "I want to build X", "grill me", "what should the plan be", "think this through with me", or before starting any non-trivial implementation.
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

Before asking anything, scan the codebase for relevant code:

- Identify the modules, files, and patterns that relate to the request
- Note existing conventions, abstractions, and boundaries
- Look for prior art — has something similar been built before?

State what you found in 2-3 sentences. This grounds the interrogation in reality.

### Step 2: Interrogate

Load `references/interrogation-protocol.md`. Ask ONE question at a time. For every question, provide a **recommended answer** based on what you found in the codebase.

Key rules:
- If a question is answerable by reading code, answer it yourself and move on
- One question at a time — each answer shapes the next question
- Walk the decision tree — resolve foundations before dependencies
- Flag fuzzy terms — propose a sharp version, ask if it's right
- Surface tensions with existing code — "The codebase does X. You're proposing Y."

**Budget:** 5-10 questions, then synthesize.

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

- Don't ask questions you can answer by reading the codebase. The whole point is that you explore first.
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
