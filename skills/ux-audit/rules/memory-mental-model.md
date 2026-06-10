---
title: Mental Model
impact: MEDIUM-HIGH
kind: rubric
prefix: memory
tags: memory, expectation, conventions, familiarity, research
related: memory-jakobs-law, decision-paradox-of-the-active-user, perception-selective-attention
---

## Mental Model

A mental model is the compressed picture a user already holds of how a system should work, built from prior products, real-world objects, and category conventions. When the design matches that model, the user transfers existing knowledge and feels fluent. When it mismatches, every interaction costs deliberate thought and confidence drops. This is a rubric-based rule: score how well labels, icons, and interactions match user expectations.

This is the general principle. **Jakob's Law is the special case where the prior system is "other websites and apps."** A mental model can also come from physical artifacts, domain conventions, or the user's own past sessions. Do not penalize a deliberate, well-explained novel pattern; penalize unexplained novelty.

## Rubric

**Surfaces:** primary-nav, form, modal, dashboard

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | All labels match domain vocabulary the user already uses; icons use Lucide/Material/SF Symbols semantics; interaction patterns (drag, swipe, undo) follow platform norms. |
| 4 | Mostly conventional; one or two custom icons or labels that need a tooltip to discover. |
| 3 | Mix of conventional and custom: e.g. uses ⊕ for "add" but ⌬ for "configure"; some labels are jargon. |
| 2 | Frequent invented vocabulary or icons; users learn through trial and error. |
| 1 | Heavy custom vocabulary with no on-ramp; interactions break platform conventions (drag-to-delete, swipe-to-confirm). |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Replace custom icons with Lucide / Material / SF Symbols equivalents whose established meaning matches the action (trash for delete, archive for archive, gear for settings).
- Rename invented labels ("Beam it", "Sync to cloud") to the domain-standard term users already use ("Send", "Save").
- Honour platform interaction conventions: drag reorders, swipe reveals actions, ⌘Z undoes. Do not invent destructive gestures (drag-to-delete, swipe-to-confirm).
- Disambiguate overloaded actions: if "Save" actually publishes, rename it to "Publish" (and add a separate "Save draft").
- For deliberate novelty, add an on-ramp: a one-time inline introduction at first encounter.

## Examples

**Anti-pattern (fails):**

```tsx
// "Save" actually publishes to all viewers immediately.
// Trash icon archives but does not delete.
function Toolbar() {
  return (
    <div className="flex gap-2">
      <button>Save</button>
      <button aria-label="Delete"><TrashIcon /></button>
    </div>
  );
}
```

**Applied (passes):**

```tsx
function Toolbar() {
  return (
    <div className="flex gap-2">
      <button>Save draft</button>
      <button>Publish</button>
      <button aria-label="Move to archive"><ArchiveIcon /></button>
      <button aria-label="Delete permanently"><TrashIcon /></button>
    </div>
  );
}
```

Reference: https://lawsofux.com/mental-model/
