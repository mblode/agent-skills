---
title: Use descriptive link text, never "click here"
impact: MEDIUM-HIGH
tags: links, anchor-text, accessibility
---

## Use descriptive link text, never "click here"

Link text must describe the destination and make sense out of context. Screen readers list links by text alone -- "click here" and "learn more" are meaningless in a list of 20 links.

**Incorrect (vague link text):**

```markdown
To configure authentication, [click here](auth.md).

For more information, [see this page](rate-limits.md).
```

**Correct (descriptive link text):**

```markdown
See [Configure authentication](auth.md) for setup steps.

Review the [rate limit thresholds](rate-limits.md) before going live.
```

Reference: [W3C — Link text and purpose](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
