---
title: Open with context where the site renders no breadcrumb
impact: MEDIUM-HIGH
tags: navigation, breadcrumbs, wayfinding, prerequisites
---

## Open with context where the site renders no breadcrumb

Readers arrive from search and deep links, not from the top. A docs site shows them where they are through its sidebar and breadcrumb, so repeating "this guide is part of the X series" on every page is noise. Plain Markdown in a repository has no such chrome, and any page that depends on an earlier one has a prerequisite the reader may not have met. In those two cases the opening lines name the parent or the prerequisite and link to it.

**Incorrect (repo Markdown page with no indication of what came before):**

```markdown
# Token rotation

Rotate tokens every 90 days to reduce the impact of leaked
credentials...
```

**Correct (opening sentence names the prerequisite):**

```markdown
# Token rotation

This guide assumes you have created API tokens; see
[Create API tokens](create-tokens.md) if not.

Rotate tokens every 90 days to reduce the impact of leaked
credentials...
```

Reference: [Nielsen Norman Group: Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/)
