---
title: Pareto Principle
impact: MEDIUM
kind: rubric
prefix: decision
tags: 80-20, prioritization, vital-few, analytics
related: decision-choice-overload, decision-occams-razor
---

## Pareto Principle

Roughly 80% of outcomes come from 20% of causes. In product UI, a small set of features carries most usage, a small set of pages drives most conversion, a small set of bugs causes most support tickets. The numbers are heuristic (sometimes 70/30, 90/10) but the distribution is consistently lopsided. Rubric-based rule: score how well the UI foregrounds its vital few.

Use it as a prioritization tool, not a deletion tool. Find the vital 20% (top tasks, entry points, errors) and over-invest there. Treat the long tail as eligible for triage (keep, demote, or kill) but do not give it equal real estate.

## Rubric

**Surfaces:** primary-nav, dashboard, secondary-nav

**Score the surface against the closest anchor:**

| Score | Anchor |
|---|---|
| 5 | Most-used features are largest, closest to entry, fewest clicks; rarely-used features live in submenus with sensible names; analytics-driven foregrounding visible. |
| 4 | Top features foregrounded; one or two secondary features get more attention than usage warrants. |
| 3 | Equal weighting: every feature gets a top-level nav entry regardless of frequency. |
| 2 | Inversion: rarely-used features (settings, account) more prominent than primary features. |
| 1 | UI optimized for showcasing capability, not getting users to their goal. |

For full anchor examples and common scoring confusions, see `references/observational-rubrics.md`.

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | score ≥4 |: |
| warn | score = 3 | MEDIUM |
| fail | score ≤2 | HIGH |

## Fix

**If fail or warn:**

- Foreground the top-20% of features (by analytics or strategic value) in the primary nav and home dashboard: larger, closer to entry, fewer clicks away.
- Demote rarely-used features (settings, account, exports, admin) to submenus, drawers, or `/settings` routes with sensible names.
- Validate the 20% with usage analytics; do not guess. Sort pages/features by sessions or conversion impact, stop at cumulative 80%.
- Re-order navigation so primary tasks come first; remove top-level entries outside the vital few.
- Avoid alphabetized or feature-parity layouts that give every module equal visual weight.

## Examples

**Anti-pattern (fails):**

```tsx
<DashboardGrid columns={4}>
  {/* All 32 modules rendered identically, alphabetized */}
  {modules.map((m) => <Tile key={m.id} {...m} />)}
</DashboardGrid>
```

**Applied (passes):**

```tsx
<Dashboard>
  <PrimaryRow>
    <Tile size="lg" {...modules.byId.run} />
    <Tile size="lg" {...modules.byId.deploy} />
    <Tile size="lg" {...modules.byId.logs} />
  </PrimaryRow>
  <SecondaryRow>
    {/* Next 5 most-used, smaller, condensed */}
  </SecondaryRow>
  <Drawer label="More tools">
    {/* Long tail: settings, exports, admin */}
  </Drawer>
</Dashboard>
```

Reference: https://lawsofux.com/pareto-principle/
