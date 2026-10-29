---
title: One italic word in every heading
id: slop-italic-accent-word
category: slop
defaultTier: backlog
detect: static
related: slop-trending-display-serif, slop-slogan-headings
---

## One italic word in every heading

"Ship *faster*", "Built for *teams*", "Work that *flows*": each section heading italicises one word, often in a contrasting serif. Italic emphasis says "stress this word, not the others", and the reader hears it. On one heading that can be the point. On every heading the stresses land on interchangeable adjectives, the page sounds like it is performing, and the one heading that needed emphasis has nothing left to use.

## Detection

Count headings per file that contain an `<em>`, `<i>`, or an `italic` span. More than one is the finding.

```bash
rg -cUP "<h[1-3]\b(?:(?!</h[1-3]>)[\s\S]){0,400}?(?:<(?:em|i)\b|className=\"[^\"]*\bitalic\b)" -g '*.tsx' -g '*.jsx' src/ | awk -F: '$2 > 1'
```

Sum across a page's section components before deciding: one italic heading per component is still one per section.

## False positives

- **Titles of works** (a book, a film, a ship) are italic by convention, not emphasis.
- **Real contrastive stress** ("Not *what* it does, *why*") where the sentence needs the emphasis to parse.
- **Editorial pages** with a long-standing house style of italic decks.

## Fix

Let the sentence carry the weight, and keep italic for the one place it changes the meaning.

```tsx
// before
<h2>Built for <span className="font-serif italic">teams</span></h2>

// after
<h2>One calendar for everyone on the project</h2>
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-italic-accent-word, book titles are italic by convention */}
```
