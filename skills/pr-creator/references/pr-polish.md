# PR Polish

Restructure commits and add reviewer guidance so a large or messy PR reads cleanly. Loaded by pr-creator on the triggers below.

## When to activate

- PR has >500 lines changed
- Commit history has fixup, WIP, or "address review" commits
- Reviewer has asked for restructuring
- Multiple unrelated changes bundled in one PR
- User asks to polish or tidy the PR

## Tree hash verification

Before and after any history rewrite, verify the code has not changed:

```bash
git rev-parse HEAD^{tree}
```

Save the hash before, compare after. Differing hashes mean the rewrite changed code, not just history: abort and investigate before pushing anything.

## Commit ordering

Restructure commits by dependency order so reviewers follow the progression:

1. Schema / migration changes
2. Core logic (models, services, business rules)
3. Integration / wiring (routes, controllers, API endpoints)
4. UI (components, styles, layouts)
5. Tests
6. Config / docs / tooling

Each commit must compile and pass lint independently; if one depends on a later commit, reorder.

## Non-interactive history rewriting

`git rebase -i` needs interactive input (unavailable to agents), so use a soft reset and rebuild:

```bash
# Save tree hash
TREE_BEFORE=$(git rev-parse HEAD^{tree})

# Find the merge base with the target branch
BASE=$(git merge-base HEAD origin/main)

# Soft reset to the merge base (keeps all changes staged)
git reset --soft $BASE

# Rebuild commits in logical order
git add <schema-files> && git commit -m "Add user role column migration"
git add <logic-files> && git commit -m "Add role-based permission checks"
git add <ui-files> && git commit -m "Add role selector to settings page"
git add <test-files> && git commit -m "Add permission and role tests"

# Verify tree hash matches
TREE_AFTER=$(git rev-parse HEAD^{tree})
[ "$TREE_BEFORE" = "$TREE_AFTER" ] || echo "WARNING: tree hash mismatch"
```

## PR description enhancements

Add reviewer guidance without making the description verbose:

- **TL;DR**: 1-2 sentences at the top explaining what changed and why
- **Review path**: "Start with `migration.sql`, then `permissions.ts`, then the UI" (only for PRs with 5+ files)
- **Risk callout**: one line for anything non-obvious, such as "The migration locks the users table; run during low traffic"

No file-by-file changelogs, test plan sections, or bullets restating the diff. The base rules in SKILL.md still apply.

## Splitting strategy

When a PR touches unrelated areas, extract independent changes:

1. Identify logically independent commits or file groups
2. Create a new branch from main for the extracted work
3. Cherry-pick or recreate the independent commits
4. Push the extracted branch and create a separate PR
5. Remove the extracted commits from the original branch
6. Update the original PR description to note the split

Only split genuinely independent work; splitting coupled changes adds review overhead instead of removing it.

## Guardrails

- Force-push only with `git push --force-with-lease`. Plain `--force` overwrites commits a teammate pushed while you rewrote.
- Verify the tree hash before and after every rewrite; a mismatch means you changed code, not just history.
- Run lint and tests after restructuring; reordering can leave an intermediate commit that doesn't compile.
- Don't rewrite commits a reviewer has commented on: it orphans inline comments anchored to those SHAs and the reviewer loses the thread.
- Don't restructure shared multi-contributor branches without coordinating: their local history diverges on the next pull.
