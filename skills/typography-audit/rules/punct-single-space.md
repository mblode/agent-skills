---
title: One Space After Periods
impact: CRITICAL
tags: spacing, periods, sentences, double-space
---

## One Space After Periods

Use exactly one space between sentences. Double spacing after periods is a typewriter-era habit. HTML collapses multiple spaces, but they survive in `<pre>` blocks, emails, and CMS content.

**Incorrect (double spaces):**

```html
<p>Typography matters.  Good type improves readability.  Every detail counts.</p>
```

**Correct (single spaces):**

```html
<p>Typography matters. Good type improves readability. Every detail counts.</p>
```

Audit copy for double spaces; normalize in the CMS or build pipeline.
