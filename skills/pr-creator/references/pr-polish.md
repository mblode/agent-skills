# PR Polish

Restructure commits and add a review path so a large or messy PR reads cleanly. Loaded by pr-creator when commits are noisy, the diff exceeds 500 lines, or the user asks to polish, squash, restructure, or split.

Do this before the first push wherever possible. Rewriting history under an open PR marks inline comments on the old SHAs "outdated" and the reviewer loses their thread.

## Guardrails

- Snapshot the tree before any rewrite and compare after. Same hash means only history changed; a different hash means code changed, so stop and investigate before pushing.

  ```bash
  TREE_BEFORE=$(git rev-parse HEAD^{tree})
  # ... rewrite ...
  [ "$TREE_BEFORE" = "$(git rev-parse HEAD^{tree})" ] || echo "TREE CHANGED: abort"
  ```

- Push a rewritten branch with `git push --force-with-lease`, never plain `--force`. Plain force overwrites commits a teammate pushed while you were rewriting; with-lease refuses when the remote moved.
- Do not rewrite a branch other people have commits on without telling them; their next pull diverges.
- Read the repo's commit convention from `git log --oneline -20` and match it. If the log uses Conventional Commits (`feat(scope): ...`), write new commits that way; if it does not, do not introduce it in one PR.
- After restructuring, run lint and tests on HEAD as an external check. Reordering can leave an intermediate commit that references code from a later one; that is a readability problem, not a blocker, unless the repo bisects.

## Pick the lightest rewrite that fits

| Situation | Rewrite |
|-----------|---------|
| Fixups aimed at specific earlier commits ("address review", typo fixes, "oops") | Autosquash |
| Commits are fine but one message is wrong, and it is the tip | `git commit --amend -m "..."` |
| Commits interleave unrelated work, or the order fights the reader | Soft reset and rebuild |
| The PR bundles independent changes a reviewer could approve separately | Split |

### Autosquash

Mark each stray commit as a fixup of its target, then let git fold them in. `GIT_SEQUENCE_EDITOR=true` accepts the generated todo list unchanged, so no editor opens.

```bash
BASE=$(git merge-base HEAD origin/main)
git commit --fixup=<target-sha>              # for new stray changes; an existing stray commit needs the soft reset path unless its subject already starts with "fixup!"
GIT_SEQUENCE_EDITOR=true git rebase -i --autosquash "$BASE"
```

Git 2.44 and later also accept `git rebase --autosquash "$BASE"` with no `-i`; the `GIT_SEQUENCE_EDITOR` form works on every version (verified on 2.43), so it is the default here. Any commit whose subject already begins `fixup!` or `squash!` is folded without further flags, and fixups never open a commit editor, so the command completes with no TTY.

### Soft reset and rebuild

For a full reorder, collapse the branch to one staged change and recommit it in reading order. This is non-interactive by construction, which is why it beats scripting `GIT_SEQUENCE_EDITOR` with `sed` for anything more than a squash.

```bash
BASE=$(git merge-base HEAD origin/main)
git reset --soft "$BASE"                     # all changes stay staged, history is gone

git commit -m "Add user role column migration" -- <schema-files>
git commit -m "Add role-based permission checks" -- <logic-files>
git commit -m "Add role selector to settings page" -- <ui-files>
git commit -m "Add permission and role tests" -- <test-files>
```

`git commit -m ... -- <paths>` commits only the named paths from the index and leaves the rest staged, so the next commit picks up where the last one stopped. The split is by file: `git add -p` needs a terminal, so when one file carries two logical changes, keep them in one commit rather than fighting it.

Reading order, when the change has these layers:

1. Schema and migrations
2. Core logic (models, services, business rules)
3. Wiring (routes, controllers, endpoints)
4. UI (components, styles)
5. Tests
6. Config, docs, tooling

### Split

Extract the independent slice onto its own branch, then rebuild the original without it.

```bash
git switch -c <new-branch> origin/main
git cherry-pick <sha>...                     # the independent commits, oldest first
git push -u origin HEAD                      # then gh pr create for this slice per SKILL.md

git switch <original-branch>
# soft reset and rebuild, omitting the extracted files
```

Add `Part of ABC-123` to both bodies if they share one Linear issue, and one line in the original PR saying what moved where. Split only work that a reviewer could approve without the other PR; splitting coupled changes doubles the review, it does not halve it.

## Review path in the description

The one-paragraph rule in SKILL.md still applies. For a diff over 500 lines or touching five or more files, add one line telling the reviewer where to start:

```text
Review path: start with migration.sql, then permissions.ts, then the UI.
```

The `Risk:` line, when the change earns one, follows the same rule as SKILL.md: one line, only for something non-obvious ("The migration locks the users table; run during low traffic").
