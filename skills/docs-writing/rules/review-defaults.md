---
title: Review defaults
impact: LOW-MEDIUM
tags: review, defaults, quality
---

## Review defaults

Apply before publishing:

- **Test with a fresh reader**: have someone unfamiliar with the feature follow the doc from scratch; note where they get stuck
- **Read aloud, cut what makes you stumble**: remove 20% of the words each editing pass
- **Verify against the current implementation**: run every code example, check parameter names, confirm default values against the actual software

**Incorrect (unreviewed first draft with stale content):**

```markdown
In order to be able to configure the application, you will
need to first make sure that you have created a configuration
file. Run the CLI with the `--verbose` flag to enable logging.
```

**Correct (edited, verified, and reader-tested):**

```markdown
Create a configuration file in the project root.

Run the CLI with the `--debug` flag to enable logging.
```

Reference: [Write the Docs: Documentation review guide](https://www.writethedocs.org/guide/docs-as-code/)
