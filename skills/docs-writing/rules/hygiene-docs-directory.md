---
title: All documentation lives in the docs/ directory
impact: MEDIUM
tags: location, organization, directory
---

## All documentation lives in the docs/ directory

A reader who can't find a page assumes it doesn't exist and asks, or guesses. Keep docs in `docs/` (or the project's established equivalent), with subdirectories by Diataxis type so the folder tells a reader which kind of page they are opening. Subdirectory READMEs are the exception: they describe that specific directory. Docs living next to the code they describe is also what lets a docs change ride in the same PR (`review-docs-with-code`).

**Incorrect (docs scattered across the repo):**

```markdown
wiki/setup.md
notes/architecture.md
guides/deployment.md
src/utils/HOWTO.md
```

**Correct (one directory, subdirectories by type):**

```markdown
docs/tutorials/getting-started.md
docs/how-to/deploy-to-production.md
docs/reference/api.md
docs/explanation/architecture.md
README.md
src/utils/README.md
```

Reference: [Write the Docs: Docs as code](https://www.writethedocs.org/guide/docs-as-code/)
