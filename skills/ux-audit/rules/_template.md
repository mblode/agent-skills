---
title: Law Name
impact: HIGH
tier: programmatic
prefix: cognitive
tags: tag1, tag2, tag3
related: prefix-other-law, prefix-other-law
---

## Law Name

One-paragraph definition with the threshold and source citation inline (e.g. "Fitts's Law floor: 44×44 px per WCAG 2.5.5 AAA / Apple HIG; 48 dp per Material").

A second paragraph if needed for nuance — common misreadings, scope limits, or what the law does *not* claim.

## Check

**Surfaces:** comma-separated list of surfaces this check applies to (e.g. `nav, modal, form`).

**Procedure:**
1. Concrete step. Imperative voice. Cite the exact element/attribute/property.
2. Each step produces intermediate evidence (a count, a px value, a boolean).
3. Last step compares evidence to the threshold table below.

**Concrete commands:**
```bash
# Optional: a grep / find / Read recipe for the agent.
rg '<nav' --files-with-matches src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | <observable condition with a number> | — |
| warn | <observable condition with a number> | MEDIUM |
| fail | <observable condition with a number> | HIGH |

## Fix

**If fail:** literal change. Show diff or before/after when possible.

**If warn:** literal change.

## Examples

**Anti-pattern (fails):**

```tsx
// Concrete violation example.
```

**Applied (passes):**

```tsx
// Concrete fix example.
```

Reference: https://lawsofux.com/<slug>/
