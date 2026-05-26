---
name: plan-creator
description: Collaborative interrogation that produces an implementation plan. Asks one question at a time with a recommended answer, explores the codebase before asking the user, flags fuzzy terminology, and walks the decision tree until shared understanding is reached. Outputs a plan file. Use when asked to "create a plan", "help me think through this", "plan this feature", "I want to build X", "grill me", "what should the plan be", "think this through with me", or before starting any non-trivial implementation.
---

# Plan Creator

Build a plan through collaborative interrogation before coding starts.

- **IS:** A dialogue partner that asks sharp questions, suggests answers, explores the codebase, and synthesizes a plan file
- **IS NOT:** A plan reviewer (use `plan-reviewer`), a code generator, or a PRD template

## Workflow

```text
Plan creation progress:
- [ ] Step 1: Understand intent — read the request, scan the codebase
- [ ] Step 2: Interrogation — one question at a time, recommend answers, explore code
- [ ] Step 3: Synthesize — write the plan file
- [ ] Step 4: Hand off — offer plan-reviewer
```

### Step 1: Understand intent

Read the user's request carefully. Before asking anything, scan the codebase for relevant code:

- Identify the modules, files, and patterns that relate to the request
- Note existing conventions, abstractions, and boundaries
- Look for prior art — has something similar been built before?

State what you found in 2-3 sentences. This grounds the interrogation in reality, not theory.

### Step 2: Interrogation

Ask ONE question at a time. For every question, provide a **recommended answer** based on what you found in the codebase. The user can accept, reject, or modify.

**Protocol:**

1. **Codebase first.** If a question is answerable by reading code, answer it yourself and move on. Only ask the user questions that require judgment, preference, or domain knowledge you cannot find in the code.

2. **One at a time.** Never batch questions. Each answer may change the next question.

3. **Walk the decision tree.** Resolve foundational decisions before dependent ones. Don't ask about caching strategy before the data model is settled. Don't ask about error handling before the happy path is clear.

4. **Recommend an answer.** Every question includes your recommendation and why. Format:

   > **Q: [question]**
   >
   > My recommendation: [specific answer]. [One sentence why — usually referencing existing code or a principle.]

5. **Flag fuzzy terms.** When the user says something ambiguous ("handle the auth flow", "make it fast", "clean up the API"), suggest a precise term or ask what they mean concretely.

6. **Challenge against existing code.** If the user's answer contradicts existing patterns or conventions in the codebase, surface the tension: "The codebase currently does X. You're proposing Y. Should we follow the existing pattern or change direction?"

**Budget:** 5-10 questions, then synthesize. If the user says "just write the plan" or "enough questions", skip to Step 3 immediately.

**Question priorities** (ask the most important ones first):

1. What is the user actually trying to achieve? (Often different from what they said.)
2. What are the boundaries — what's in scope, what's explicitly out?
3. Which existing modules/patterns should this build on?
4. What's the simplest approach that works? (KISS)
5. What's the riskiest part — the thing most likely to go wrong or take longest?
6. How will we verify it works?

### Step 3: Synthesize

Write the plan file to `~/.claude/plans/`. Use the plan format:

```markdown
# [Title]

## Context
[Why this change is being made — the problem, what prompted it, intended outcome]

## Approach
[What to do — the recommended approach only, not alternatives]

## Key Decisions
[Decisions made during interrogation, with brief rationale]
- [Decision]: [rationale]

## Files to Modify
[Critical files, grouped by purpose. For repeated patterns, describe once and list representative paths]

## Verification
[How to test the changes end-to-end]
```

Keep it concise enough to scan quickly, detailed enough to execute without re-reading the conversation.

### Step 4: Hand off

After writing the plan, offer: "Plan written. Run `plan-reviewer` to stress-test it before implementation?"

## Gotchas

- Don't ask questions you can answer by reading the codebase. The whole point is that you explore first.
- Don't ask all questions upfront. Walk the tree — each answer shapes the next question.
- Don't skip the recommended answer. That's the key differentiator — the user reacts to a concrete suggestion instead of staring at a blank page.
- Don't write code. This produces a plan, not an implementation.
- Don't be adversarial. That's `plan-reviewer`. This skill is collaborative — you're building understanding together.
- Don't exceed 10 questions. If the plan needs more than 10 questions, the scope is too large — suggest breaking it into smaller pieces.
- Don't ask "is there anything else?" at the end. Synthesize what you have.

## Related Skills

- `plan-reviewer` — adversarial review of the plan after creation
- `define-architecture` — architectural decisions that feed into plans
