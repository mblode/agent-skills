# Merge Conflicts

Detection, resolution strategies, and safety guardrails for keeping a PR branch up to date.

## Contents

- [Conflict Detection](#conflict-detection)
- [Resolution Strategy](#resolution-strategy)
- [Rebase Workflow](#rebase-workflow)
- [Auto-Resolvable Conflicts](#auto-resolvable-conflicts)
- [Do NOT Auto-Resolve](#do-not-auto-resolve)
- [Safety Guardrails](#safety-guardrails)

## Conflict Detection

```bash
gh pr view --json mergeable,mergeStateStatus
```

| `mergeStateStatus` | Meaning | Action |
|--------------------|---------|--------|
| `CLEAN` | No conflicts, up to date | Skip |
| `BEHIND` | Base has advanced, no conflicts yet | Rebase to update |
| `DIRTY` | Actual conflicts exist | Resolve |
| `UNSTABLE` | Mergeable but failing checks | Skip (Phase 3 handles checks) |
| `BLOCKED` | Branch protection prevents merge | Skip (review/checks needed) |
| `HAS_HOOKS` | Merge hooks pending | Skip |
| `UNKNOWN` | GitHub is computing | Wait, recheck next cycle |

## Resolution Strategy

**Prefer rebase when:**
- Branch has clean linear history
- Few commits (< 10)
- Only you are working on the branch
- Team convention is rebase

**Prefer merge when:**
- Branch is shared with other contributors
- Rebase would rewrite commits others have based work on
- User explicitly prefers merge

If unsure about team convention, ask the user.

## Rebase Workflow

```bash
# 1. Stash any uncommitted work
git stash

# 2. Fetch latest base
git fetch origin {base_branch}

# 3. Attempt rebase
git rebase origin/{base_branch}

# 4a. If clean — push
git push --force-with-lease

# 4b. If conflicts — evaluate (see below)
# On abort:
git rebase --abort
git stash pop
```

## Auto-Resolvable Conflicts

These file types can be resolved automatically:

**Lockfiles** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`):
1. Abort the rebase
2. Merge base branch instead: `git merge origin/{base_branch}`
3. Accept the incoming lockfile
4. Re-run the package manager: `npm install` / `yarn` / `pnpm install`
5. Commit the regenerated lockfile
6. Push with `--force-with-lease`

**Generated files** (`.generated`, `schema.graphql`, GraphQL types):
1. Accept either side
2. Re-run the generation command
3. Commit the regenerated output

**Changelogs** (`CHANGELOG.md`, `CHANGES.md`):
1. Accept both sides
2. Reorder entries by date (newest first)
3. Commit

**Config files with additive changes** (both sides added different keys):
1. Accept both additions
2. Verify no semantic conflicts
3. Commit

## Do NOT Auto-Resolve

Notify the user and provide details for these:

- **Source code with logic conflicts** — both sides modified the same function body
- **Database migrations** — ordering matters, incorrect resolution breaks the migration chain
- **API contracts / OpenAPI specs** — semantic changes require human judgment
- **Files where both sides deleted and added on overlapping lines** — intent is ambiguous
- **Test files with conflicting assertions** — the correct assertion depends on intent

When aborting, provide the user with:
- List of conflicting files
- Which lines conflict in each file
- What each side changed (ours vs theirs)

## Safety Guardrails

1. **Always `--force-with-lease`, never `--force`** — lease check ensures no one else pushed since your last fetch. If the lease fails, someone else has pushed — abort and notify
2. **Stash before rebase** — `git stash` saves uncommitted work. Pop after resolution
3. **Abort on failure** — if auto-resolution fails or produces unexpected results, always `git rebase --abort` to restore the branch
4. **Never rebase a shared branch without asking** — if other contributors have pushed to this branch, rebase rewrites their history
5. **Verify after resolution** — after pushing, check that `gh pr view --json mergeable` returns `MERGEABLE`
6. **One resolution per cycle** — if a conflict reappears on the next poll (base advanced again), resolve again. Do not batch multiple base updates
