---
title: Choose Sentence or Title Case Consistently
impact: CRITICAL
tags: capitalization, title-case, sentence-case, headings
---

## Choose Sentence or Title Case Consistently

Pick either sentence case or title case for headings and apply the choice consistently throughout the project. Title case feels more formal; sentence case feels more casual and friendly. Auto-format titles per your chosen style guide.

**Incorrect (inconsistent casing):**

```html
<h1>Getting Started with Typography</h1>  <!-- title case -->
<h2>How to choose the right font</h2>     <!-- sentence case -->
<h3>Best Practices For Line Height</h3>   <!-- inconsistent title case -->
```

**Correct (consistent sentence case):**

```html
<h1>Getting started with typography</h1>
<h2>How to choose the right font</h2>
<h3>Best practices for line height</h3>
```

**Or consistent title case:**

```html
<h1>Getting Started with Typography</h1>
<h2>How to Choose the Right Font</h2>
<h3>Best Practices for Line Height</h3>
```

Always capitalize the first word, proper nouns, and "I" regardless of chosen style. Use `text-transform: capitalize` with caution as it does not follow title case rules for small words.
