---
title: One Space After Periods
impact: CRITICAL
tags: spacing, periods, sentences, double-space
---

## One Space After Periods

Use exactly one space between sentences. Double spacing after periods is a typewriter-era habit with no place in modern typography. HTML collapses multiple spaces by default, but double spaces can appear in `<pre>` blocks, emails, and CMS content.

**Incorrect (double spaces):**

```html
<p>Typography matters.  Good type improves readability.  Every detail counts.</p>
```

**Correct (single spaces):**

```html
<p>Typography matters. Good type improves readability. Every detail counts.</p>
```

Audit existing copy for double spaces and remove them. Configure your CMS or build pipeline to normalize spacing.
