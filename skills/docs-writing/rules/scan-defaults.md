---
title: Scanability defaults
impact: MEDIUM
tags: scanability, defaults, readability
---

## Scanability defaults

Apply these defaults to every documentation page:

- **Front-load key information** -- lead sentences and sections with the main point, push caveats to the end
- **Use white space between logical groups** -- add blank lines between conceptual groups, keep paragraphs to 3-5 sentences
- **Replace prose with diagrams and tables where possible** -- use diagrams for flows, tables for comparisons
- **Mix short and long sentences for rhythm** -- alternate punchy sentences (5-10 words) with explanatory ones (15-25 words)

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

Reference: [Nielsen Norman Group — How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/)
