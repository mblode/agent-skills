---
title: Choose Sentence or Title Case Consistently
impact: CRITICAL
tags: capitalization, title-case, sentence-case, headings
---

## Choose Sentence or Title Case Consistently

Pick sentence case or title case for headings and apply it consistently across the project. Title case feels formal; sentence case feels casual. Auto-format per your style guide.

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

Always capitalize the first word, proper nouns, and "I" regardless of style. Use `text-transform: capitalize` with caution: it does not follow title-case rules for small words.
