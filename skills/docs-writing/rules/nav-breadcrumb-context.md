---
title: Establish page location with an opening link or breadcrumb
impact: MEDIUM-HIGH
tags: navigation, breadcrumbs, wayfinding
---

## Establish page location with an opening link or breadcrumb

Readers arrive at docs pages from search, deep links, and bookmarks -- not always from the top. Each page must help readers understand where they are in the docs hierarchy without requiring them to navigate there manually.

**Incorrect (no indication of section or hierarchy):**

```markdown
# Token rotation

Rotate tokens every 90 days to reduce the impact of leaked
credentials...
```

**Correct (opening sentence establishes context):**

```markdown
# Token rotation

This guide is part of the [Authentication](index.md) series.

Rotate tokens every 90 days to reduce the impact of leaked
credentials. For initial token setup, see
[Create API tokens](create-tokens.md).
```

Reference: [Nielsen Norman Group — Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/)
