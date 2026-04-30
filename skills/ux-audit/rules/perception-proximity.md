---
title: Law of Proximity
impact: HIGH
tier: programmatic
prefix: perception
tags: gestalt, grouping, spacing, layout, perception
related: perception-similarity, perception-common-region, perception-uniform-connectedness, cognitive-chunking
---

## Law of Proximity

A Gestalt grouping principle: items placed near each other read as belonging together. Spacing is the cue. When two elements share less whitespace with each other than with their surroundings, the eye binds them into a group before any label, border, or color is processed. Threshold for legible grouping: inter-group spacing should be at least 2× the intra-group spacing (see Lidwell, *Universal Principles of Design*; lawsofux.com/law-of-proximity).

Among the four grouping laws, proximity is the baseline cue. Uniform Connectedness and Common Region beat it when they conflict — a card border holds its contents together even if internal spacing is loose. Use proximity to do the work first; reach for borders only when spacing alone cannot communicate the group.

## Check

**Surfaces:** dashboard, list, form

**Procedure:**
1. Find groups (cards, sections, form blocks, list items with metadata).
2. Compute intra-group spacing (Tailwind `space-y-*`, `gap-*`, or CSS `margin`/`padding` values between items inside a group).
3. Compute inter-group spacing (the same values between groups).
4. Compute the ratio inter:intra. Compare to the threshold table.

**Concrete commands:**
```bash
rg 'space-y-|gap-|className.*space' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | inter/intra ratio ≥2× consistently across the surface | — |
| warn | ratio between 1.5× and 2× | MEDIUM |
| fail | ratio <1.5× (groups visually indistinguishable) | HIGH |

## Fix

**If fail:** Increase inter-group spacing to ≥2× intra-group, or reduce intra-group spacing. Example: form using `space-y-4` for everything → wrap each section in a `<fieldset class="space-y-4">` and separate fieldsets with `space-y-10`.

**If warn:** Bump the inter-group token by one step (e.g. `space-y-6` → `space-y-10`).

## Examples

**Anti-pattern (uniform spacing destroys grouping):**

```html
<!-- Every field 16px apart. User can't tell which label belongs to which input,
     or which inputs form the address vs. the payment block. -->
<form class="space-y-4">
  <label>First name</label>
  <input />
  <label>Last name</label>
  <input />
  <label>Street</label>
  <input />
  <label>City</label>
  <input />
  <label>Card number</label>
  <input />
  <label>CVC</label>
  <input />
</form>
```

**Applied (spacing encodes structure):**

```html
<form class="space-y-10">
  <fieldset class="space-y-4">
    <legend class="font-medium">Name</legend>
    <div class="space-y-1"><label>First</label><input /></div>
    <div class="space-y-1"><label>Last</label><input /></div>
  </fieldset>

  <fieldset class="space-y-4">
    <legend class="font-medium">Shipping</legend>
    <div class="space-y-1"><label>Street</label><input /></div>
    <div class="space-y-1"><label>City</label><input /></div>
  </fieldset>

  <fieldset class="space-y-4">
    <legend class="font-medium">Payment</legend>
    <div class="space-y-1"><label>Card number</label><input /></div>
    <div class="space-y-1"><label>CVC</label><input /></div>
  </fieldset>
</form>
```

Reference: https://lawsofux.com/law-of-proximity/
