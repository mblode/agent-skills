---
title: Law of Common Region
impact: HIGH
tier: programmatic
prefix: perception
tags: gestalt, grouping, container, card, perception
related: perception-proximity, perception-uniform-connectedness, cognitive-chunking
---

## Law of Common Region

A Gestalt grouping principle: items inside a clearly defined boundary read as a group. The boundary can be a border, a shared background, or a tinted region. Enclosure is a stronger grouping cue than spacing or similarity — a card binds its contents even when the items inside are visually different and slightly far apart (Palmer 1992; lawsofux.com/law-of-common-region).

Order of grouping strength when cues compete: Uniform Connectedness > Common Region > Proximity > Similarity. Reach for Common Region when proximity alone cannot carry the structure, when items inside the group are visually heterogeneous, or when the group must survive responsive reflow.

## Check

**Surfaces:** dashboard, list

**Procedure:**
1. Find groups of related items (dashboard widgets, list rows with metadata, settings sections).
2. Check for a shared boundary: `<fieldset>`, a card with `border` or `bg-*`, `<section>`, `role="region"`, or a tinted container.
3. Verify the boundary actually encloses the logical group — does not split a group across two regions, does not merge two unrelated groups.

**Concrete commands:**
```bash
rg '<section|<fieldset|role="region"|border |rounded.*bg-' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | every logical group on dense surfaces has a visible boundary that matches the group | — |
| warn | groups separated only by spacing (proximity carrying the load on a dense surface) | MEDIUM |
| fail | boundaries split a logical group across regions, OR no boundaries at all on dense surfaces (dashboard/list with ≥3 group types) | HIGH |

## Fix

**If fail:** Wrap each logical group in a `<section class="rounded-lg border border-slate-200 bg-white p-4">` (or equivalent). Make sure each region encloses exactly one group; don't nest cards more than one level deep.

**If warn:** Add a subtle boundary (border or background tint) to groups that currently rely only on spacing.

## Examples

**Anti-pattern (no enclosure, mixed content reads as one stream):**

```html
<!-- Order summary, shipping address, and payment card flow as one column.
     User scans top-to-bottom and loses track of which value belongs to which section. -->
<div class="space-y-2">
  <h3>Order summary</h3>
  <p>2 items · $84.00</p>
  <h3>Shipping</h3>
  <p>123 Main St, Brooklyn NY</p>
  <h3>Payment</h3>
  <p>Visa ending 4242</p>
</div>
```

**Applied (each section in its own region):**

```html
<div class="space-y-4">
  <section class="rounded-lg border border-slate-200 bg-white p-4">
    <h3 class="font-medium">Order summary</h3>
    <p class="text-slate-600">2 items · $84.00</p>
  </section>

  <section class="rounded-lg border border-slate-200 bg-white p-4">
    <h3 class="font-medium">Shipping</h3>
    <p class="text-slate-600">123 Main St, Brooklyn NY</p>
  </section>

  <section class="rounded-lg bg-slate-50 p-4">
    <h3 class="font-medium">Payment</h3>
    <p class="text-slate-600">Visa ending 4242</p>
  </section>
</div>
```

Reference: https://lawsofux.com/law-of-common-region/
