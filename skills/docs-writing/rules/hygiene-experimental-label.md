---
title: Mark experimental features with a visible note
impact: MEDIUM
tags: experimental, preview, warning
---

## Mark experimental features with a visible note

If a feature is experimental or in preview, add a callout immediately after the intro paragraph. Readers must know before they invest time building on an unstable API or feature.

**Incorrect (experimental feature documented without any warning):**

```markdown
## Batch processing endpoint

Send up to 1000 items in a single request using the
`/api/batch` endpoint.
```

**Correct (clear experimental callout before details):**

```markdown
## Batch processing endpoint

Send up to 1000 items in a single request using the
`/api/batch` endpoint.

> **Note:** This feature is in preview and may change without
> notice. Do not use in production.
```

Reference: [Google developer documentation — Deprecation and experimental notices](https://developers.google.com/style/notices)
