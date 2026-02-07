---
title: Include last-updated date or version
impact: MEDIUM
tags: metadata, dates, freshness
---

## Include last-updated date or version

Readers need to know if docs are current. Include a "Last updated" date or the product version the doc applies to. This helps readers assess whether the information is still accurate before they invest time.

**Incorrect (no indication of freshness):**

```markdown
## Configure authentication

Set the `AUTH_PROVIDER` environment variable to your identity
provider's URL.
```

**Correct (version or date signals freshness):**

```markdown
---
last_updated: 2026-01-15
applies_to: v3.2+
---

## Configure authentication

Set the `AUTH_PROVIDER` environment variable to your identity
provider's URL.
```

Reference: [Microsoft Style Guide — Content freshness](https://learn.microsoft.com/en-us/style-guide/)
