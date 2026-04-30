---
title: Choice Overload
impact: HIGH
tier: programmatic
prefix: decision
tags: choices, comparison, filtering, defaults
related: decision-hicks-law, decision-pareto-principle, cognitive-cognitive-load
---

## Choice Overload

When the option set crosses ~7-10 comparable items shown at once, users stall, regret their pick, or abandon the task entirely (Iyengar & Lepper, 2000 — the jam study showed a 10× drop in conversion at 24 vs 6 options). The damage is not just slower decisions; it is lower satisfaction with whatever they choose.

The fix is rarely "delete options." It is to design the *decision flow*: surface a recommended default, support comparison for items that need it, and let users narrow the set up front through search, filters, or curated rails.

## Check

**Surfaces:** pricing, search-results

**Procedure:**
1. Find pricing/plan/product grids or filter facet panels.
2. Count comparable peers shown without filtering or comparison UI (count `Plan`, `Tier`, `ProductCard`, facet checkboxes at the same level).
3. Check for a "recommended", "most popular", "featured", or `defaultValue` flag on one item.

**Concrete commands:**
```bash
rg '<Plan |<Tier |<ProductCard|<Facet' --files-with-matches src/
rg 'recommended|popular|featured|default' src/pricing/ src/plans/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | ≤ 5 peers OR a recommended flag is present | — |
| warn | 6-10 peers without a recommended flag | MEDIUM |
| fail | > 10 peers without a recommended flag | HIGH |

## Fix

**If fail:** Cut to 3-5 hero tiers, add a recommended/popular badge on one, and move the rest behind "Compare all" or filters. For long catalogues, lead with a curated "Featured" rail before the full grid.

**If warn:** Add a `badge="Recommended"` or `defaultValue` on the best-fit option so the easy choice is the obvious one.

## Examples

**Anti-pattern (15 plans, equal weight, no comparison):**

```html
<div class="plans">
  <Plan name="Free" />
  <Plan name="Personal" />
  <Plan name="Personal+" />
  <Plan name="Hobby" />
  <Plan name="Starter" />
  <!-- ... ten more, no recommended, no compare table ... -->
</div>
```

**Applied (3 tiers + comparison table + recommended default):**

```tsx
<PricingTiers default="pro">
  <Tier name="Free" />
  <Tier name="Pro" badge="Recommended" />
  <Tier name="Team" />
</PricingTiers>

<details>
  <summary>Compare all features</summary>
  <ComparisonTable plans={["Free", "Pro", "Team"]} />
</details>
```

For a long catalogue, lead with filters and a curated "Featured" rail before the full grid:

```tsx
<Catalogue>
  <Filters facets={["category", "price", "rating"]} />
  <FeaturedRail items={topPicks} />
  <Grid items={filtered} />
</Catalogue>
```

Reference: https://lawsofux.com/choice-overload/
