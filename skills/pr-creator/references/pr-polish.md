# PR Polish

Restructure commits and improve PR descriptions for reviewer experience. Load when the user asks to polish a PR, clean up commits, make a PR easy to review, or when the diff exceeds 500 lines.

## When to activate

- PR has >500 lines changed
- Commit history has fixup, WIP, or "address review" commits
- Reviewer has asked for restructuring
- Multiple unrelated changes bundled in one PR
- User explicitly asks to polish or tidy the PR

## Tree hash verification

Before and after any history rewriting, verify the code hasn't changed:

```bash
git rev-parse HEAD^{tree}
```

Save the hash before rewriting. After rewriting, compare. If the hashes differ, the rewrite changed code — abort and investigate.

## Commit ordering

Restructure commits by dependency order so reviewers can follow the logical progression:

1. Schema / migration changes
2. Core logic (models, services, business rules)
3. Integration / wiring (routes, controllers, API endpoints)
4. UI (components, styles, layouts)
5. Tests
6. Config / docs / tooling

Each commit should compile and pass lint independently. If a commit depends on a later one, reorder.

## Non-interactive history rewriting

Since `git rebase -i` requires interactive input, use this approach:

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

Add reviewer guidance to the PR description without making it verbose:

- **TL;DR** — 1-2 sentences at the top explaining what changed and why
- **Review path** — "Start with `migration.sql`, then `permissions.ts`, then the UI" (only for PRs with 5+ files)
- **Risk callout** — one line for anything non-obvious: "The migration locks the users table — run during low traffic"

Do not add file-by-file changelogs, test plan sections, or bullet lists restating the diff.

## Splitting strategy

When a PR touches unrelated areas, extract independent changes:

1. Identify commits or file groups that are logically independent
2. Create a new branch from main for the extracted work
3. Cherry-pick or recreate the independent commits
4. Push the extracted branch and create a separate PR
5. Remove the extracted commits from the original branch
6. Update the original PR description to note the split

Only split when the extracted work is genuinely independent — splitting coupled changes creates review overhead.

## Guardrails

- Never force-push without `--force-with-lease`
- Always verify tree hash before and after rewriting
- Run lint and tests after restructuring to catch ordering issues
- Do not rewrite commits that have already been reviewed — only rewrite unreviewed history
- If the PR has existing review comments, preserve the commit SHAs those comments reference
- Do not restructure on shared branches with multiple contributors without coordinating
