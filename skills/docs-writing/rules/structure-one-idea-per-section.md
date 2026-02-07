---
title: One topic per section
impact: CRITICAL
tags: structure, sections, focus, organization
---

## One topic per section

Each section should advance one concept, feature, or step. Splitting keeps sections focused, scannable, and individually linkable. Test: if you can't summarize a section in one sentence, it covers too much.

**Incorrect (two topics merged into one section):**

```markdown
## Authentication

To set up authentication, create an API key in the dashboard and
add it to your configuration file:

    AUTH_KEY=your-key-here

If authentication fails, check these common issues:
- Expired API key: Generate a new key in the dashboard.
- Clock skew: Ensure your server time is within 5 minutes of UTC.
- IP allowlist: Verify your server IP is on the allowlist.
```

**Correct (each topic in its own section):**

```markdown
## Set up authentication

Create an API key in the dashboard and add it to your configuration
file:

    AUTH_KEY=your-key-here

## Troubleshoot authentication errors

If authentication fails, check these common issues:

- **Expired API key**: Generate a new key in the dashboard.
- **Clock skew**: Ensure your server time is within 5 minutes of UTC.
- **IP allowlist**: Verify your server IP is on the allowlist.
```

Reference: [Write the Docs — Content organization](https://www.writethedocs.org/guide/writing/style-guides/)
