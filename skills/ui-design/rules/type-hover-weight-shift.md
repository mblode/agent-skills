---
title: Do not change font-weight on hover or selected
id: type-hover-weight-shift
category: type
defaultTier: backlog
detect: static
related: states-layout-shift, type-readable-scale
---

## Do not change font-weight on hover or selected

Bumping `font-weight` on hover, focus, or selected nav items makes the label wider, so neighbours shift. The user sees the row jump rather than a state change. Use color, opacity, background, or underline for selected and hover; keep the weight stable.

## Detection

Search for hover or selected variants that set a different font weight.

```bash
rg -nP 'hover:font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black)|data-\[(?:state=active|selected)\]:font-|aria-selected:font-|aria-current:font-' -g '*.tsx' -g '*.jsx' -g '*.css' src/
```

Skip a weight change that is the only indication of a selected tab and is paired with a reserved slot (fixed-width item, `tabular-nums`, or a max-width that already contains the bold label). Skip body copy that is not a control.

**Incorrect (selected weight reflows the row):**

```tsx
<Link className="font-medium hover:font-bold data-[active]:font-bold" href="/inbox">
  Inbox
</Link>
```

**Correct (weight stays put):**

```tsx
<Link className="font-medium text-zinc-600 hover:text-zinc-950 data-[active]:text-zinc-950" href="/inbox">
  Inbox
</Link>
```
