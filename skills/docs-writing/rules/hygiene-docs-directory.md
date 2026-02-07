---
title: All documentation lives in the docs/ directory
impact: MEDIUM
tags: location, organization, directory
---

## All documentation lives in the docs/ directory

Documentation scattered across the repo is undiscoverable. Keep all docs in `docs/` (or the project's equivalent). READMEs in subdirectories are the exception -- they describe that specific directory.

**Incorrect (docs scattered across the repo):**

```markdown
wiki/setup.md
notes/architecture.md
guides/deployment.md
src/utils/HOWTO.md
```

**Correct (all docs in one directory with subdirectories by type):**

```markdown
docs/tutorials/getting-started.md
docs/reference/api.md
docs/howto/deploy-to-production.md
README.md
src/utils/README.md
```

Reference: [Diataxis — Documentation system](https://diataxis.fr/)
