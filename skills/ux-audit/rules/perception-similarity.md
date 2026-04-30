---
title: Law of Similarity
impact: HIGH
tier: programmatic
prefix: perception
tags: gestalt, grouping, color, shape, perception
related: perception-proximity, perception-common-region, cognitive-chunking
---

## Law of Similarity

A Gestalt grouping principle: items that share visual properties — color, shape, size, weight, orientation — read as related, even when separated in space. Similarity carries semantic weight: matching styles imply matching function, mismatched styles imply different function. Threshold for coherent role: ≥80% of items in the same role should share at least one visual property (lawsofux.com/law-of-similarity; Wertheimer 1923).

Among the grouping laws, similarity is weaker than enclosure (Common Region) or shared backgrounds (Uniform Connectedness) and roughly comparable to Proximity. Use it to communicate role: links share a color, primary actions share a shape, destructive actions share a hue. Inverting the rule is just as load-bearing — anything that *should not* be confused with another role must look different.

## Check

**Surfaces:** list, dashboard, primary-nav

**Procedure:**
1. Find sets of same-role elements (list items, cards, buttons of the same type, nav links).
2. Compare visual properties: classes, color, font weight, shape/border-radius, size.
3. Compute the percentage of role-mates that share ≥1 visual property. Compare to the threshold table.

**Concrete commands:**
```bash
rg 'className=' src/ | rg 'button|Card|li|nav'
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | ≥80% of same-role items share styling | — |
| warn | 50–80% share styling | MEDIUM |
| fail | <50% share styling (visual chaos; role unreadable) | HIGH |

## Fix

**If fail:** Extract a shared component or class for the role (e.g. `<NavLink>`, `btn-primary`) and apply it to every member. Pair color with a redundant cue (weight, icon, underline) so the role survives color-blindness.

**If warn:** Audit outliers and align them to the dominant style; remove ad-hoc inline classes.

## Examples

**Anti-pattern (similarity hides function):**

```tsx
// Inline link, ghost button, and disabled button all look the same — users
// can't tell what is clickable vs. what is just text.
<p>
  Read the <span className="text-slate-700">terms of service</span> before
  continuing. <button className="text-slate-700">Accept</button>{' '}
  <button className="text-slate-700" disabled>Decline</button>
</p>
```

**Applied (visual properties encode role):**

```tsx
<p className="text-slate-700">
  Read the{' '}
  <a href="/terms" className="text-blue-600 underline">terms of service</a>{' '}
  before continuing.
</p>

<div className="mt-4 flex gap-2">
  <button className="bg-blue-600 text-white rounded px-4 py-2">Accept</button>
  <button className="border border-slate-300 text-slate-700 rounded px-4 py-2">
    Decline
  </button>
</div>
```

Reference: https://lawsofux.com/law-of-similarity/
