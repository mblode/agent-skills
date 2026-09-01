---
title: Delete outdated docs, don't leave them to rot
impact: MEDIUM
tags: maintenance, outdated, deletion
---

## Delete outdated docs, don't leave them to rot

Outdated docs are worse than none: they mislead with authority. Delete docs for removed features; update docs when behavior changes. Where a migration needs the old behavior for context, put it in a collapsed `<details>` block (Markdown has no equivalent, so raw HTML is right here) rather than leaving stale prose inline.

**Incorrect (doc for a removed feature still in navigation):**

```markdown
## XML export

Use the `/export/xml` endpoint to generate an XML report.
<!-- This endpoint was removed in v3.0 -->
```

**Correct (doc deleted, migration note added where needed):**

```markdown
<!-- xml-export.md deleted -->
<!-- All links updated to point to the JSON export doc -->

## JSON export

Use the `/export/json` endpoint. XML export was removed in v3.0.
For migration details, see [v3.0 changelog](changelog.md#v30).
```

Reference: [Google developer documentation style guide: Timeless documentation](https://developers.google.com/style/timeless-documentation)
