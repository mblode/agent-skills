---
title: Declare Document and Inline Language
impact: CRITICAL
impactDescription: makes screen readers pronounce content correctly
tags: accessibility, language, i18n
---

## Declare Document and Inline Language

Set the primary language on `<html lang>` with a valid BCP 47 tag, and mark any inline passage in another language with its own `lang`. Without it, a screen reader reads every page with one pronunciation engine.

**Incorrect (no document language, foreign phrase unmarked):**

```html
<html>
  <body><p>The chef called it a <em>coup de grâce</em>.</p></body>
</html>
```

**Correct (document and inline language declared):**

```html
<html lang="en">
  <body><p>The chef called it a <em lang="fr">coup de grâce</em>.</p></body>
</html>
```
