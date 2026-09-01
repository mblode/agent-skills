---
title: Change docs in the same PR as the code, with prose lint in CI
impact: LOW-MEDIUM
tags: docs-as-code, ci, vale, markdownlint, review
---

## Change docs in the same PR as the code, with prose lint in CI

Docs that ship in a separate PR ship late or never, and the reviewer who knows the behavior changed has already moved on. Docs-as-code fixes both: the docs live in the repository (`hygiene-docs-directory`), the change to them rides in the PR that changes the behavior, and CI lints them like code. Vale with the Google or Microsoft style package catches the voice and clarity categories mechanically; markdownlint catches heading and list structure; a link checker (`review-verify-links`) catches renames. Findings the tools already report are not findings for a human reviewer to repeat.

**Incorrect (behavior change merged, docs "to follow"):**

```markdown
<!-- PR #482: rename --verbose to --debug -->
<!-- Files changed: src/cli.ts -->
<!-- Description: "Will update docs in a follow-up" -->
```

**Correct (docs in the diff, linted on the PR):**

```markdown
<!-- PR #482: rename --verbose to --debug -->
<!-- Files changed: src/cli.ts, docs/reference/cli.md -->

<!-- .vale.ini -->
StylesPath = .vale/styles
MinAlertLevel = suggestion
Packages = Google
[*.md]
BasedOnStyles = Vale, Google

<!-- .github/workflows/docs.yml runs vale, markdownlint, and lychee on docs/**/*.md -->
```

Reference: [Write the Docs: Docs as code](https://www.writethedocs.org/guide/docs-as-code/), [Vale](https://docs.vale.sh/)
