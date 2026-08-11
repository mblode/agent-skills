---
title: Make Error Messages Actionable
id: microcopy-actionable-error-messages
category: microcopy
defaultTier: fix-this-sprint
detect: static
---

## Make Error Messages Actionable

Error messages should include what failed and what to do next. A message that only names the problem sends the user back into the same failed attempt.

## Detection

Find the stock failure phrases, excluding any line that goes on to name a next step.

```bash
rg -nPi '(something went wrong|an error occurred|request failed|oops)(?![^\n]*\b(try again|retry|check|contact|refresh)\b)' -g '*.tsx' -g '*.jsx' src/
```

Strings held in an i18n catalogue never match here, so run the same pattern over the locale JSON. A message split across two elements (heading plus a separate paragraph carrying the next step) matches on the heading line and is a false positive; read the surrounding block.

**Incorrect (problem only):**

```tsx
<p>Something went wrong.</p>
```

**Correct (problem + next step):**

```tsx
<p>Upload failed. Check your connection and try again.</p>
```
