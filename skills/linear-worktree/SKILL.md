---
name: linear-worktree
description: Creates a sibling git worktree and local branch for a Linear issue using a fast path from the repo's default branch. Handles Linear issue URLs, Linear copy-as-prompt text, and bare issue IDs; validates Git-safe branch names; and prints a terse summary with worktree path and branch. Use when the user asks "make a worktree", "set up a branch", "start work on this Linear issue", or provides an issue ID like "ABC-58" or "tig-232".
---

# linear-worktree

Create a sibling git worktree for a Linear issue. Keep the path simple and only branch off the fast path when something fails.

## Fast Path

Copy and track this checklist:

```text
Worktree creation progress:
- [ ] Parse ISSUE_ID and slug
- [ ] Resolve repo root and worktree path
- [ ] Build and validate BRANCH
- [ ] Reuse existing branch, or create from verified origin default branch
- [ ] Verify and summarize
```

### 1. Parse Input

Accepted inputs:

- Linear URL: `https://linear.app/myteam/issue/ABC-58/add-dark-mode-toggle`
- Linear copy-as-prompt text: `ABC-58 Add dark mode toggle to settings page`
- Bare issue ID: `ABC-58` or `tig-232`

Set:

- `ISSUE_ID`: lowercase, e.g. `abc-58`
- `DISPLAY_ID`: uppercase, e.g. `ABC-58`
- `SLUG`: from the URL tail or Linear copy-as-prompt title

For bare IDs, use the bare issue ID as the branch unless a Linear get-by-ID tool is already available. Do not spend time discovering Linear tools just to improve the slug.

Slug rule: lowercase, remove apostrophes/backticks, replace non-`[a-z0-9]` runs with `-`, collapse hyphens, trim, cap at 50 chars.

### 2. Resolve Repo

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"
REPOS_BASE="$(dirname "$REPO_ROOT")"
WORKTREE_PATH="$REPOS_BASE/$REPO_NAME-$ISSUE_ID"
```

If not inside a git repo, use `config.json` only when both `repos_base` and `default_repo` are set; otherwise ask for the repo path.

### 3. Create Worktree

```bash
BRANCH="$ISSUE_ID${SLUG:+-$SLUG}"
git -C "$REPO_ROOT" check-ref-format --branch "$BRANCH"

if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git -C "$REPO_ROOT" worktree add "$WORKTREE_PATH" "$BRANCH"
elif git -C "$REPO_ROOT" show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  git -C "$REPO_ROOT" worktree add --track -b "$BRANCH" "$WORKTREE_PATH" "origin/$BRANCH"
else
  DEFAULT_BRANCH="$(git -C "$REPO_ROOT" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's@^origin/@@')"
  test -n "$DEFAULT_BRANCH"
  BASE_REF="refs/remotes/origin/$DEFAULT_BRANCH"
  git -C "$REPO_ROOT" fetch origin "+refs/heads/$DEFAULT_BRANCH:$BASE_REF"
  git -C "$REPO_ROOT" rev-parse --verify "$BASE_REF^{commit}" >/dev/null
  git -C "$REPO_ROOT" worktree add -b "$BRANCH" "$WORKTREE_PATH" "$BASE_REF"
fi
```

If `DEFAULT_BRANCH` is empty, ask for it. If `git worktree add` fails because the path exists or the branch is checked out elsewhere, stop and surface the git error. Do not delete directories, force checkout, or rename branches.

### 4. Verify and Summarize

Do not assume `cd` persists. Use `git -C "$WORKTREE_PATH"` or a tool-level workdir.

```bash
TOPLEVEL="$(git -C "$WORKTREE_PATH" rev-parse --show-toplevel)"
HEAD_BRANCH="$(git -C "$WORKTREE_PATH" symbolic-ref --quiet --short HEAD)"
test "$TOPLEVEL" = "$WORKTREE_PATH"
test "$HEAD_BRANCH" = "$BRANCH"
```

Summary format:

```text
ABC-58 - Add dark mode toggle

Worktree: /Users/you/Code/linktree/frontyard-abc-58
Branch:   abc-58-add-dark-mode-toggle
```

If Linear lookup was not used, do not apologize. The worktree path and branch are the important output.

## Gotchas

- Use `git worktree add`, not `git checkout -b`.
- Worktree path is a sibling of the repo, never inside it.
- Always create new branches from verified `origin/$DEFAULT_BRANCH`, not stale local `main`.
- Linear lookup is optional. It is useful for bare IDs, but it should not slow the common URL/copy-as-prompt path.
