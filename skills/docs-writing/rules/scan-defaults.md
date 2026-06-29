---
title: Scanability defaults
impact: MEDIUM
tags: scanability, defaults, readability
---

## Scanability defaults

Apply to every page:

- **Front-load key information**: lead with the main point, push caveats to the end
- **White space between logical groups**: blank lines between conceptual groups, paragraphs of 3-5 sentences
- **Diagrams and tables over prose**: diagrams for flows, tables for comparisons
- **Mix short and long sentences**: alternate punchy (5-10 words) with explanatory (15-25 words)

**Incorrect (buries the answer, no grouping, uniform sentences, prose where a table fits):**

```markdown
While there are several options, and depending on your needs,
you might want to consider the trade-offs. Option A is fast.
Option B is cheap. Option C is reliable. After evaluating the
options, the recommended approach is Option B.
```

**Correct (leads with the answer, grouped content, varied rhythm, table for comparison):**

```markdown
Use Option B for most deployments.

| Option | Speed | Cost | Reliability |
|--------|-------|------|-------------|
| A      | Fast  | High | Medium      |
| B      | Medium| Low  | High        |
| C      | Slow  | Low  | High        |
```

Reference: [Nielsen Norman Group: How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/)
