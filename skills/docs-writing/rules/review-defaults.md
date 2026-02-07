---
title: Review defaults
impact: LOW-MEDIUM
tags: review, defaults, quality
---

## Review defaults

Apply these checks before publishing any documentation:

- **Test with a fresh reader** -- have someone unfamiliar with the feature follow the doc from scratch and note where they get stuck
- **Read aloud and cut anything that makes you stumble** -- aim to remove 20% of the words on each editing pass
- **Verify docs match the current implementation** -- run every code example, check parameter names, and confirm default values against the actual software

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

Reference: [Write the Docs — Documentation review guide](https://www.writethedocs.org/guide/docs-as-code/)
