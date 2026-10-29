---
title: A coloured left border on cards that are not callouts
id: slop-left-accent-border
category: slop
defaultTier: backlog
detect: static
related: slop-decoration-no-role, slop-token-drift
---

## A coloured left border on cards that are not callouts

Every feature card, testimonial, or list item has a thick coloured rule down its left edge (`border-l-4 border-violet-500`) and nothing else to set it apart. A left rule is borrowed from blockquotes and notices, where it means "this is an aside" or "this needs your attention". On every card it means neither, the rounded corner fights the straight rule at the top and bottom, and the one real notice on the page loses the signal it needed.

## Detection

A rounded element with a thick left border in a non-neutral colour.

```bash
rg -nUP "<(?!blockquote\b)[A-Za-z][\w.]*\b(?=[^>]*?\bborder-l-(?:2|4|8|\[\d+px\])(?![\w-]))(?=[^>]*?\bborder-(?:l-)?(?!(?:gray|zinc|slate|neutral|stone|border|input|muted|transparent|white|black)\b)(?:[a-z]+-\d{2,3}|primary|accent|brand)\b)(?=[^>]*?\brounded(?:-[a-z0-9]+)?\b)[^>]*>" -g '*.tsx' -g '*.jsx' src/
```

Then read what the element is: confirmed when it is a card or list item rather than a notice, alert, or quote.

## False positives

- **Real callouts and notices** ("Storage almost full", a warning in docs) where the rule marks severity, ideally with a matching icon and `role="status"` or `role="alert"`.
- **Blockquotes and pull quotes,** which the pattern already skips when they are `<blockquote>`.
- **Active navigation items** where the left rule marks the current page.

## Fix

Separate cards with space or a quiet surface, and keep the left rule for the notice that needs it.

```tsx
// before
<div className="rounded-lg border-l-4 border-violet-500 p-4">{feature.title}</div>

// after
<div className="rounded-lg bg-muted p-4">{feature.title}</div>
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-left-accent-border, this is the storage warning callout */}
```
