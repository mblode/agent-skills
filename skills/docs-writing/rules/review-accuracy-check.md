---
title: Verify docs match the current implementation
impact: LOW-MEDIUM
tags: accuracy, code-sync, verification
---

## Verify docs match the current implementation

Run every code example. Click every UI path described. Verify that default values, parameter names, and error messages match the actual software. Docs that contradict the code are worse than no docs.

**Incorrect (outdated flag name in documentation):**

```markdown
## Enable verbose logging

Run the CLI with the `--verbose` flag:

    myapp --verbose
```

```bash
# Actual CLI (--verbose was renamed to --debug in v2.0):
myapp --debug
```

**Correct (docs verified against current codebase):**

```markdown
## Enable debug logging

Run the CLI with the `--debug` flag:

    myapp --debug
```

Reference: [Write the Docs — Docs as code](https://www.writethedocs.org/guide/docs-as-code/)
