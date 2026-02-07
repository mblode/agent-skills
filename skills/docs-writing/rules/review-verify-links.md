---
title: Verify all links point to valid destinations
impact: LOW-MEDIUM
tags: links, broken-links, maintenance
---

## Verify all links point to valid destinations

Broken links destroy trust. After any doc change, verify that all outbound links still resolve. Check both internal doc links and external URLs. Automate this check in CI when possible.

**Incorrect (renamed doc without updating inbound links):**

```markdown
For setup instructions, see [Getting started](setup.md).
<!-- setup.md was renamed to getting-started.md -->
```

**Correct (links verified after every rename or restructure):**

```markdown
For setup instructions, see
[Getting started](getting-started.md).

<!-- CI runs markdown-link-check on every PR -->
```

Reference: [markdown-link-check — Link validation tool](https://github.com/tcort/markdown-link-check)
