---
title: Use Sentence Case for Headings
impact: HIGH
tags: capitalization, sentence-case, title-case, headings
---

## Use Sentence Case for Headings

Set headings, buttons, labels, and nav items in sentence case, and apply it everywhere. Sentence case reads faster, survives translation, and never leaves a reviewer arguing over whether "For" is capitalized. Title case is defensible in editorial contexts, but only as a whole-project decision, never mixed in file by file. Enforce the choice in the build or CMS rather than by hand.

**Incorrect (inconsistent casing):**

```html
<h1>Getting Started with Typography</h1>  <!-- title case -->
<h2>How to choose the right font</h2>     <!-- sentence case -->
<h3>Best Practices For Line Height</h3>   <!-- inconsistent title case -->
```

**Correct (sentence case throughout):**

```html
<h1>Getting started with typography</h1>
<h2>How to choose the right font</h2>
<h3>Best practices for line height</h3>
<button>Save changes</button>
```

Always capitalize the first word, proper nouns, and "I". Do not reach for `text-transform: capitalize` to fake title case; it capitalizes every word including articles and prepositions, which no title-case style permits. Wording itself (what a heading should say) belongs to `copywriting`; this rule governs only the casing.
