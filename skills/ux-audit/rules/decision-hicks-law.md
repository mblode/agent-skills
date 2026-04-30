---
title: Hick's Law
impact: HIGH
tier: programmatic
prefix: decision
tags: choices, navigation, decision-time, progressive-disclosure
related: decision-choice-overload, cognitive-millers-law, cognitive-cognitive-load, perception-von-restorff
---

## Hick's Law

Decision time grows logarithmically with the number and complexity of options (Hick & Hyman, 1952). The practical ceiling for a single ungrouped layer is ~7 peers — Miller's chunk limit. Beyond that, decision cost compounds with scan cost: the user is no longer choosing, they are searching for what to choose.

The fix is rarely "fewer items." It is fewer items *visible at once*: group, prioritize, and progressively disclose. Highlight a recommended path so the easy decision is the default. Beware over-collapsing — replacing choice cost with search cost is not a win.

## Check

**Surfaces:** primary-nav, secondary-nav, modal, search-results, pricing

**Procedure:**
1. Find the element to count: `<nav>`, `role="navigation"`, `<menu>`, the footer of a `role="dialog"`, or a pricing-plan grid.
2. Count direct interactive children (`<a>`, `<button>`, `Plan` cards, `MenuItem` components). Do not recurse into submenus.
3. Subtract items inside `role="group"` subgroups (each subgroup counts as 1).

**Concrete commands:**
```bash
rg '<nav|role="navigation"' --files-with-matches src/
rg 'role="dialog"' --files-with-matches src/
rg '<Plan |<PricingTier' --files-with-matches src/
```

## Threshold

| Tier | Condition | Severity |
|---|---|---|
| pass | count ≤ 7 | — |
| warn | count 8-10 | MEDIUM |
| fail | count > 10 | HIGH |

## Fix

**If fail:** Group items into 3-5 categories. Promote 1 primary action; demote tertiary items into a submenu, mega-menu, or "More" disclosure. Flag a recommended option for plan grids.

**If warn:** Introduce 1-2 logical groupings or move 1-3 lowest-priority items behind a disclosure so the visible count drops to ≤7.

## Examples

**Anti-pattern (flat 12-item primary nav):**

```html
<nav>
  <a href="/products">Products</a>
  <a href="/solutions">Solutions</a>
  <a href="/integrations">Integrations</a>
  <a href="/templates">Templates</a>
  <a href="/changelog">Changelog</a>
  <a href="/pricing">Pricing</a>
  <a href="/customers">Customers</a>
  <a href="/blog">Blog</a>
  <a href="/docs">Docs</a>
  <a href="/community">Community</a>
  <a href="/about">About</a>
  <a href="/careers">Careers</a>
</nav>
```

**Applied (5 top-level groups, recommended plan flagged):**

```tsx
<nav>
  <NavGroup label="Product">{/* Products, Integrations, Templates */}</NavGroup>
  <NavGroup label="Solutions">{/* by industry, by team */}</NavGroup>
  <a href="/pricing">Pricing</a>
  <NavGroup label="Resources">{/* Docs, Blog, Community, Changelog */}</NavGroup>
  <NavGroup label="Company">{/* About, Customers, Careers */}</NavGroup>
</nav>

<PricingGrid recommended="pro">
  <Plan name="Starter" />
  <Plan name="Pro" badge="Most popular" />
  <Plan name="Enterprise" />
</PricingGrid>
```

Reference: https://lawsofux.com/hicks-law/
