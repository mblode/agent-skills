---
name: changelog-draft
description: Drafts the Fennel Desk release entry from the commits since the last tag. Use when asked to "draft the changelog", "write the release entry", or "what changed since the last release".
argument-hint: "[since-tag]"
context: fork
agent: general-purpose
disable-model-invocation: true
allowed-tools: Bash(git log:*) Bash(git describe:*) Read Write
---

# Changelog Draft

Last tag: !`git describe --tags --abbrev=0`

Draft the release entry for everything merged since $ARGUMENTS, or since the last tag above when no tag is given.

## Steps

1. Collect the merged changes:

   ```bash
   ${CLAUDE_SKILL_DIR}/scripts/collect.sh "$ARGUMENTS"
   ```

   It prints one line per merged pull request: number, label, title.
2. Drop every line labelled `internal` or `deps`.
3. Group the rest under Added, Changed, and Fixed, using the `feature`, `change`, and `fix` labels.
4. Rewrite each title from the support agent's side. "Add macro variables for assignee" becomes "Macros can now insert the assignee's name".
5. Write the entry to `content/releases/<version>.mdx`, where `<version>` is the `version` field in `package.json`.
6. Print the entry and the path.

## Gotchas

- A pull request with the `breaking` label goes first under Changed with the migration step in the same line.
- Do not include a pull request that was reverted later in the same range. `collect.sh` marks those lines with `reverted`.
