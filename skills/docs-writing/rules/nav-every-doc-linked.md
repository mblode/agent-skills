---
title: Every doc must be linked from at least one other doc
impact: MEDIUM-HIGH
tags: linking, discoverability, orphans
---

## Every doc must be linked from at least one other doc

An unlinked document is an undiscoverable document. Every file in the docs directory must be reachable from at least one other file -- typically through an index, sidebar, or parent page. Orphaned pages accumulate and rot.

**Incorrect (new page with no inbound links):**

```markdown
<!-- advanced-config.md exists but no other page links to it -->
# Advanced configuration

These settings control cluster behavior...
```

**Correct (parent page links to the new page):**

```markdown
<!-- In getting-started.md -->
For cluster tuning options, see [Advanced configuration](advanced-config.md).
```

Reference: [Google developer documentation style guide — Links](https://developers.google.com/style/links)
