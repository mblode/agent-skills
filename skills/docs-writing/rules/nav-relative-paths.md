---
title: Use relative paths for internal doc links
impact: MEDIUM-HIGH
tags: links, paths, relative
---

## Use relative paths for internal doc links

Link between docs with relative paths. Absolute paths break when docs are hosted at different base URLs or built into subfolders.

**Incorrect (absolute path, vague link text):**

```markdown
See [here](/docs/reference/api.md) for more info.
```

**Correct (relative path, descriptive context):**

```markdown
See [API authentication methods](../reference/api.md#authentication) for token setup.
```

Reference: [MDN: Absolute vs. relative URLs](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL#absolute_urls_vs._relative_urls)
