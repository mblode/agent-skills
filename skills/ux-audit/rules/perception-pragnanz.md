---
title: Law of Prägnanz
impact: MEDIUM
kind: rubric
prefix: perception
tags: gestalt, simplicity, perception, cognitive-effort
related: perception-similarity, decision-occams-razor, cognitive-cognitive-load
---

## Law of Prägnanz

The "law of good figure" or "law of simplicity": when faced with an ambiguous or complex shape, the eye resolves it into the simplest possible interpretation. The brain prefers the reading that costs the least cognitive effort. Simple, regular, unified shapes are processed and remembered faster than complex, irregular ones. This is a rubric-based rule: score how cleanly the composition resolves to a single reading.

Prägnanz is the umbrella principle behind the other Gestalt laws: it is *why* the brain groups by proximity, similarity, region, and connection. If your composition can be misread as a simpler shape, it will be.

## Rubric

**Surfaces:** marketing-hero, dashboard, empty-state, pricing

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Clear figure-ground; each section has one dominant shape; no competing alignments or rotations; eye flow is unambiguous. |
| 4 | Mostly clear; one element competes mildly (e.g. a tilted card in an otherwise gridded layout). |
| 3 | Multiple visual centers of gravity; user has to decide where to look first. |
| 2 | Layered, rotated, overlapping shapes without hierarchy; eye bounces. |
| 1 | Composition is a puzzle; it takes ≥3 seconds to identify the primary action. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Remove rotated, skewed, or overlapping decorative elements (tilted badges, angled banners, blob shapes layered over content).
- Adopt a single grid; align every section, card, and figure to it. No off-grid one-offs.
- Resolve competing alignments: pick left, center, or right per section and stick with it.
- Collapse near-duplicate shapes (two badges, two CTAs, two illustrations) to one dominant figure per section.
- Reduce decorative gradients and overlays so a single figure-ground reading wins.

## Examples

**Anti-pattern (fails):**

```html
<section class="relative">
  <div class="absolute inset-0 -skew-y-3 bg-gradient-to-tr from-pink-200 to-yellow-200"></div>
  <div class="absolute right-10 top-10 rotate-12 rounded-full bg-purple-500 p-6">New!</div>
  <svg class="absolute left-0 top-0"><!-- decorative blob --></svg>
  <div class="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
  <h1 class="relative text-4xl">Welcome</h1>
</section>
```

**Applied (passes):**

```html
<section class="bg-slate-50 py-24">
  <div class="mx-auto max-w-2xl text-center">
    <span class="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
      New
    </span>
    <h1 class="mt-4 text-4xl font-semibold">Welcome</h1>
    <p class="mt-2 text-slate-600">Get started in under a minute.</p>
  </div>
</section>
```

Reference: https://lawsofux.com/law-of-pr%C3%A4gnanz/
