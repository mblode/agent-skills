---
title: Headings built from stacked slogan fragments
id: slop-slogan-headings
category: slop
defaultTier: backlog
detect: static
related: slop-eyebrow-overuse, slop-fact-padding
---

## Headings built from stacked slogan fragments

"Same file. Different flights. Both edits kept." "Good questions. Clear answers." "Stay in sync. Keep it simple." Each heading is two to four words, a full stop, and a line break, repeated. The visitor has to assemble the meaning from the pieces, and often there is none to assemble: "Keep it simple" says nothing about this product and could head any page on the web. Two different models wrote "Stay in sync. Keep it simple." for the same brief, which is the tell: the line is the average of a thousand landing pages, not a sentence about this one. Stacked fragments also flatten the page, since every heading has the same clipped cadence and none reads as more important.

A single short heading is fine, and so is one fragment pair that carries a concrete fact ("One plan. $8 a seat."). The failure is the stack as house style, or a stock line any brand could print.

## Detection

Headings that open with two sentences of at most four words each.

```bash
rg -nUP "<h[1-3]\b[^>]*>(?:\s|<br\s*/>|<span[^>]*>|</span>)*[A-Z\$\d][\w’'\$,-]*(?:[ \t]+[\w’'\$,-]+){0,3}[.!?](?:\s|<br\s*/>|<span[^>]*>|</span>)+[A-Z\$\d][\w’'\$,-]*(?:[ \t]+[\w’'\$,-]+){0,3}[.!?]" \
  -g '*.tsx' -g '*.jsx' src/
```

Confirmed when two or more headings on one page match, or when one match contains no noun specific to the product (a name, a number, a feature). Also check any heading against the stock list: "Stay in sync", "Keep it simple", "Built for teams", "Work smarter", "Ready when you are", "Good questions".

## False positives

- **A fragment pair with a fact.** "One plan. $8 a seat." names the price; one such heading on a page is a choice. Report it only as part of a stack.
- **Brand taglines** set by the company and used across its site are a decision, not a default. Check the existing site or brand guide before reporting the hero line.
- **Headings rendered from a CMS** (`{section.title}`) will not match and are not this rule's to judge.

## Fix

Write one sentence that says what happens.

```tsx
// before
<h2>Same file.<br />Different flights.<br />Both edits kept.</h2>

// after
<h2>Two people edit the same file offline, and both versions are kept</h2>
```

For wording beyond the heading, hand the copy to `ghostwriter`, whose tells list carries the same pattern for prose.

## Why this needs a rule

Clipped fragment stacks are the current frontier-model default for display type: they look confident at 72px and cost nothing to generate, while a sentence specific to the product requires knowing what the product does.

## Suppression

```tsx
{/* ui-audit-ignore:slop-slogan-headings, hero line is the brand tagline from the style guide */}
```
