---
title: Paradox of the Active User
impact: MEDIUM
tier: rubric
prefix: decision
tags: onboarding, documentation, in-context-help, learnability
related: memory-jakobs-law, memory-mental-model, cognitive-cognitive-load
---

## Paradox of the Active User

Users skip the manual and start clicking. They will accept errors, dead ends, and suboptimal paths over reading documentation up front, even when reading would save time later. Treat any flow gated behind "read this first" as effectively skipped. This is a rubric-based rule: score how well guidance lives on the critical path.

Design for the user who is already doing the task. Put guidance *into* the path, not adjacent to it: inline hints, tooltips on the actual control, validation messages that describe the fix, empty states that demonstrate the next action.

## Rubric

**Surfaces:** form, empty-state, error-state, modal

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Every non-obvious field has inline help (placeholder, descriptive label, or tooltip on focus); errors explain *why* and link to the fix; new features have inline introduction at first encounter. |
| 4 | Most fields have inline help; one or two reference users to external docs unnecessarily. |
| 3 | Inline help is sparse — present on some fields, absent on others; help docs exist but in a separate /docs route. |
| 2 | Tooltips exist but only on hover; mobile users see no help; complex actions assume prior knowledge. |
| 1 | All help is in external docs; UI assumes the user has read the manual. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 | — |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Move help content from `/docs` into inline placeholders, descriptive labels, and on-focus tooltips on the actual controls.
- Rewrite validation errors to explain *why* the input failed and suggest the specific fix ("Password must include a number" not "Invalid").
- Add inline first-encounter introductions for new features — a one-line hint near the control, not a blocking tour.
- Replace hover-only tooltips with focus-triggered hints so mobile and keyboard users see them.
- Surface format constraints (password rules, file size limits) before submit, not after the failure.

## Examples

**Anti-pattern (fails):**

```tsx
<Dialog defaultOpen blocking>
  <h2>Welcome — please read before you begin</h2>
  <ScrollArea className="h-96">{/* 1500 words of feature tour */}</ScrollArea>
  <button>I have read the documentation</button>
</Dialog>
```

**Applied (passes):**

```tsx
<EmptyState>
  <h2>Create your first project</h2>
  <p>Projects group related boards and members.</p>
  <button onClick={createProject}>New project</button>
  <a href="/docs/projects">Learn about projects</a>
</EmptyState>

<Field label="Slug">
  <Input name="slug" />
  <Hint>Lowercase letters and dashes. Used in URLs.</Hint>
</Field>

<Tooltip content="Members with this role can edit but not delete.">
  <Badge>Editor</Badge>
</Tooltip>
```

Reference: https://lawsofux.com/paradox-of-the-active-user/
