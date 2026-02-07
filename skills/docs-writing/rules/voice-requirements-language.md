---
title: Use must, not should, for requirements
impact: CRITICAL
tags: voice, requirements, rfc-2119, precision
---

## Use must, not should, for requirements

"Should" is ambiguous -- readers can't tell whether it's a requirement or a suggestion. Use "must" for mandatory behavior and "we recommend" for suggestions, per RFC 2119. Avoid "please" in requirements -- it softens mandatory instructions and implies the reader has a choice.

**Incorrect (ambiguous "should" and "please"):**

```markdown
You should set the API key before making requests. The timeout
value should be at least 30 seconds. Please ensure the configuration
file has the correct permissions. You should back up the database
before upgrading.
```

**Correct (clear distinction between requirements and suggestions):**

```markdown
You must set the API key before making requests. We recommend
setting the timeout to at least 30 seconds for reliable performance.
The configuration file must have `600` permissions. Back up the
database before upgrading.
```

Reference: [RFC 2119 — Key words for use in RFCs](https://www.rfc-editor.org/rfc/rfc2119)
