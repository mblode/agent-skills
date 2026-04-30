---
title: Law of Uniform Connectedness
impact: HIGH
tier: programmatic
prefix: perception
tags: gestalt, grouping, connection, perception
related: perception-common-region, perception-proximity, cognitive-chunking
---

## Law of Uniform Connectedness

A Gestalt grouping principle: items joined by an explicit visual connection — a line, a bracket, a shared background fill, an arrow — read as more strongly related than items grouped by any other cue. Uniform Connectedness is the strongest of the four grouping laws (Palmer & Rock 1994; lawsofux.com/law-of-uniform-connectedness). Where it conflicts with Common Region, Proximity, or Similarity, connection wins.

Use it sparingly and deliberately. A connecting line, shared row background, or pill-shaped container around grouped items signals a tight relationship that the eye accepts without question. Overuse and the connection becomes noise — every line is a claim about structure, and false claims confuse.

## Check

**Surfaces:** form, list

**Procedure:**
1. Find mutually-exclusive choices (radio sets, segmented controls, toggle groups, step indicators).
2. Check for a shared connector: shared background fill, a connecting line, or a single bordered container wrapping all options.
3. Verify the connector encompasses ALL options in the set, not a subset.

**Concrete commands:**
```bash
rg 'role="radiogroup"|type="radio"|<RadioGroup|Tabs|Segmented|ToggleGroup' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | all radio/segmented/step sets share a connector that wraps every option | — |
| warn | connector incomplete (covers most but not all options, or wraps but with gaps) | MEDIUM |
| fail | no connector — radios or segments float apart with separate borders/gaps | HIGH |

## Fix

**If fail:** Wrap the set in a single container with a shared background (e.g. `<div class="inline-flex rounded-lg bg-slate-100 p-1">`) and remove per-option borders. For step indicators, draw a connecting line between steps.

**If warn:** Extend the connector to cover the missing option(s), or remove the gap between connected and disconnected items.

## Examples

**Anti-pattern (related controls float without connection):**

```html
<!-- Segmented filter: three buttons sit side by side with a gap between each.
     Users read them as three separate toggles, not as one mutually-exclusive control. -->
<div class="flex gap-2">
  <button class="rounded border px-3 py-1">All</button>
  <button class="rounded border px-3 py-1 bg-blue-600 text-white">Active</button>
  <button class="rounded border px-3 py-1">Archived</button>
</div>
```

**Applied (shared container connects the segment):**

```html
<div class="inline-flex rounded-lg bg-slate-100 p-1">
  <button class="rounded-md px-3 py-1 text-slate-600">All</button>
  <button class="rounded-md bg-white px-3 py-1 font-medium shadow-sm">Active</button>
  <button class="rounded-md px-3 py-1 text-slate-600">Archived</button>
</div>
```

Reference: https://lawsofux.com/law-of-uniform-connectedness/
