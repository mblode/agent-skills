---
title: An eyebrow over nearly every heading
id: slop-eyebrow-overuse
category: slop
defaultTier: backlog
detect: static
related: slop-decorative-ordinals, slop-slogan-headings
---

## An eyebrow over nearly every heading

A small uppercase tracked label, or a dotted pill, sits above the hero heading, then above "Made for working together", then above "Simple pricing", then above "The details". By the third one the visitor has stopped reading them: each label repeats or pre-announces the heading under it ("Simple pricing" over a pricing heading), so it adds a line to scan and no information. Used once, an eyebrow orients (a category, a launch, a section of a long document); used on every section it becomes the page's texture, and the one label that mattered gets the same weight as the rest.

`guidelines/heading-groups.md` makes the eyebrow optional. This rule is about the count: more than two eyebrows on one page is the finding, whatever each one says.

## Detection

Count, per file, short labels (uppercase, `text-xs`, or a 9 to 12px size) whose element closes directly before an `<h1>` to `<h3>`, and report files with more than two.

```bash
rg -cUP '<(p|span|div)\b[^>]*className="[^"]*\b(uppercase|text-xs|text-\[(9|10|11|12)px\])[^"]*"[^>]*>(\s*<span[^>]*/>)?[^<{]{2,80}</(p|span|div)>\s*<h[1-3]\b' \
  -g '*.tsx' -g '*.jsx' src/ | awk -F: '$2 > 2'
```

Then open each file and read the labels as a list. Confirmed when three or more exist and most restate their heading or the product category.

## False positives

- **Application UI.** A breadcrumb or workspace name above a page title ("Northwind / Preferences") is navigation, and a settings screen that styles each group `<h2>` in uppercase has nothing above it. Skip matches in application UI: this rule targets marketing sections.
- **Split pages.** Sections spread across components show one eyebrow per file. Sum the count across the page's section components before deciding, and do not report a single component that carries one.
- **Long editorial or docs pages** where the label is a real taxonomy (chapter, category, date) that differs per section. A label that carries information the heading does not is doing its job.

## Fix

Keep the one eyebrow that says something the heading cannot, and delete the rest.

```tsx
// before: every section pre-announces itself
<p className="text-xs font-bold uppercase tracking-[0.2em]">Simple pricing</p>
<h2 className="text-4xl font-semibold">$8 per seat, per month</h2>

// after: the heading carries it
<h2 className="text-4xl font-semibold">$8 per seat, per month</h2>
```

## Why this needs a rule

Frontier models now open almost every section with an eyebrow because the pattern is dense in training data and each instance looks fine in isolation; the overuse only shows when the page is read top to bottom.

## Suppression

```tsx
{/* ui-audit-ignore:slop-eyebrow-overuse, labels are the docs taxonomy and differ per section */}
```
