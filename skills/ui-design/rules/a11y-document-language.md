---
title: Declare Document and Inline Language
id: a11y-document-language
category: a11y
defaultTier: release-blocker
detect: static
---

## Declare Document and Inline Language

Set the primary language on `<html lang>` with a valid BCP 47 tag, and mark any inline passage in another language with its own `lang`. Without it, a screen reader reads everything with one pronunciation engine.

## Detection

Search for the root `<html>` element with no `lang` attribute; a single hit confirms it, since an app has one root layout.

```bash
rg -nUP '<html(?![^>]*\blang=)[^>]*>' -g '*.tsx' -g '*.jsx' -g '*.html' .
```

A root layout that spreads its attributes (`<html {...htmlProps}>`) or takes the locale from i18n middleware matches without being broken. Confirm against the served page source before reporting.

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
