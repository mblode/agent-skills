---
title: Scanability defaults
impact: MEDIUM
tags: scanability, defaults, readability
---

## Scanability defaults

Apply to every page:

- **White space between logical groups**: a blank line between conceptual groups; `clarity-defaults` owns paragraph length
- **Diagrams and tables over prose**: diagrams for flows, tables for comparisons

**Incorrect (a comparison buried in prose, one undifferentiated block):**

```markdown
Option A is fast but expensive, while Option B costs less and
performs adequately, whereas Option C is slow yet cheap and
reliable. Most deployments use Option B.
```

**Correct (recommendation set off on its own, table for the comparison):**

```markdown
Most deployments use Option B.

| Option | Speed | Cost | Reliability |
|--------|-------|------|-------------|
| A      | Fast  | High | Medium      |
| B      | Medium| Low  | High        |
| C      | Slow  | Low  | High        |
```

Reference: [Nielsen Norman Group: How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/)
