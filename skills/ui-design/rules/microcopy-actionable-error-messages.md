---
title: Make Error Messages Actionable
id: microcopy-actionable-error-messages
category: microcopy
defaultTier: fix-this-sprint
detect: static
---

## Make Error Messages Actionable

Error messages should include what failed and what to do next. A message that only names the problem sends the user back into the same failed attempt.

**Incorrect (problem only):**

```tsx
<p>Something went wrong.</p>
```

**Correct (problem + next step):**

```tsx
<p>Upload failed. Check your connection and try again.</p>
```
