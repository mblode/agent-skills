---
title: Von Restorff Effect
impact: HIGH
kind: programmatic
prefix: perception
tags: isolation, emphasis, memory, attention, perception
related: perception-selective-attention, memory-serial-position, decision-hicks-law
---

## Von Restorff Effect

Also called the Isolation Effect: when a set of similar items contains one distinctive item, the distinctive item is remembered (von Restorff 1933; lawsofux.com/von-restorff-effect). Distinctiveness can be color, weight, size, shape, motion, or position: any property that makes one item break the pattern set by the rest.

The corollary is the trap: distinctiveness is a finite resource. Highlight one item and it pulls attention. Highlight three and they fight. Highlight everything and nothing stands out: the rule dissolves and the page becomes uniform noise. Reserve emphasis for the single most important action or item per surface, and pair color with a redundant cue (weight, icon, position) so users with low vision or color-blindness still see the contrast.

## Check

**Surfaces:** primary-nav, pricing, marketing-hero, search-results

**Procedure:**
1. Find emphasized/highlighted elements (different color, heavier weight, larger size, badge, primary button styling, ring/scale).
2. Count distinct emphasis levels per surface (treat each visually-distinct "primary" treatment as one emphasis).
3. Verify only ONE primary emphasis exists on the surface.

**Concrete commands:**
```bash
rg 'variant="primary"|primary CTA|font-bold' src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | exactly one primary emphasis per surface |: |
| warn | 2 emphases competing | MEDIUM |
| fail | >2 emphases (cancellation effect: nothing stands out) | HIGH |

## Fix

**If fail:** Pick the single most important action/item and keep its emphasis. Demote the rest to secondary styling (outline button, default badge, neutral weight). For pricing tables, drop all "Most popular"/"Recommended" badges except one.

**If warn:** Demote one of the two competing emphases to secondary; pair the remaining primary with a redundant cue (icon, position, weight) so it survives color-blindness.

## Examples

**Anti-pattern (every item is "the highlighted one"):**

```tsx
// Pricing table where every plan claims emphasis. None stand out.
<div className="grid grid-cols-3 gap-4">
  <Plan name="Starter" badge="Best value" highlight />
  <Plan name="Pro" badge="Most popular" highlight />
  <Plan name="Enterprise" badge="Recommended" highlight />
</div>
```

**Applied (single distinctive item carries emphasis):**

```tsx
<div className="grid grid-cols-3 gap-4">
  <Plan name="Starter" />
  <Plan
    name="Pro"
    badge="Most popular"
    className="ring-2 ring-blue-600 scale-[1.03]"
  />
  <Plan name="Enterprise" />
</div>
```

Reference: https://lawsofux.com/von-restorff-effect/
