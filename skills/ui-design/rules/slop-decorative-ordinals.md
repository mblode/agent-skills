---
title: Ordinal numbers on items that are not a sequence
id: slop-decorative-ordinals
category: slop
defaultTier: backlog
detect: static
related: slop-eyebrow-overuse, slop-decoration-no-role
---

## Ordinal numbers on items that are not a sequence

Three feature cards labelled "01", "02", "03": "Your folder, in sync", "Two edits? Keep both", "Local comes first". A number tells the reader that order matters, that step two depends on step one, or that there is a fourth to come. Here nothing does: the cards can be shuffled without changing a word, so the reader goes looking for the sequence, finds none, and learns that this page's typography says things it does not mean. The zero-padding makes it worse, since "01" borrows the look of a spec sheet or an index for three items.

Numbering is right when the order is real: install steps, a setup flow, a ranked list, or a fallback chain ("1. Local network, 2. Encrypted relay").

## Detection

Zero-padded ordinals in item data or rendered as a lone label.

```bash
rg -nP "\b(number|num|step|index|idx|no|label|eyebrow)\s*:\s*[\"'\`]0[1-9]\b|>\s*0[1-9]\s*[./)]?\s*<" -g '*.tsx' -g '*.jsx' src/
```

Also check a `.map((item, i) => ...)` that renders `String(i + 1).padStart(2, "0")` or `{i + 1}` as a label on a card. For each hit, read the items in order and ask whether any of them depends on the one before. Confirmed when the answer is no.

## False positives

- **Real procedures.** "1. Install, 2. Pick a folder, 3. Invite your team" is a sequence; keep its numbers, and prefer an `<ol>` so assistive tech announces it.
- **Row numbers, line numbers, and version counters** inside tables, code views, and changelogs are data.
- **Timestamps, prices, and dates** that start with a zero (`09:00`, `$0.50`, `05/2026`) can match the second pattern; they are not ordinals.

## Fix

Drop the numbers, or earn them with a real sequence and an ordered list.

```tsx
// before: order implied, none exists
<span className="font-mono text-[11px]">{feature.number}</span>
<h3>{feature.title}</h3>

// after: the cards stand on their titles
<h3>{feature.title}</h3>
```

## Why this needs a rule

Zero-padded ordinals are a current model default for any group of three, and they pass a glance review because they look deliberate; only reading the items reveals there is no order to number.

## Suppression

```tsx
{/* ui-audit-ignore:slop-decorative-ordinals, these are the three setup steps in order */}
```
