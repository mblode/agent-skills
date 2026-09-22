---
title: Avoid Color-Only Meaning
id: a11y-color-only-meaning
category: a11y
defaultTier: release-blocker
detect: static
---

## Avoid Color-Only Meaning

State carried by hue alone (a red row, a green dot, a colored border) is invisible to color-blind users and on washed-out screens. Pair color with text, an icon, or shape. Contrast ratios are axe's job, not this rule's.

## Detection

Search for conditional `className` expressions whose branches differ only in a semantic hue; a hit is confirmed when nothing else in the element changes with the same condition (no text, icon, or shape).

```bash
rg -nP '\?[^:]*\b(text|bg|border)-(red|green|amber|emerald|rose|yellow)-\d' -g '*.tsx' -g '*.jsx' src/
```

An element that already pairs the hue with a label or icon matches too, since the grep only sees the class. Read the rest of the element: if the same condition also drives a `<Badge>`, an icon swap, or `aria-label` text, the state has a second channel and it passes.

**Incorrect (status is hue only):**

```tsx
<td className={run.failed ? 'text-red-700' : 'text-green-700'}>{run.name}</td>
```

**Correct (same color, state also in text):**

```tsx
<td className={run.failed ? 'text-red-700' : 'text-green-700'}>
  {run.name} <Badge>{run.failed ? 'Failed' : 'Passed'}</Badge>
</td>
```
