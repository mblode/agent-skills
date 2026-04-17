---
name: linear-worktree
description: Creates a git worktree from main for a Linear issue. Use when the user pastes a Linear URL (https://linear.app/.../issue/ABC-58/...), a Linear "copy as prompt" string, or just an issue ID like "ABC-58". Handles URL parsing, branch name derivation, and worktree creation as a sibling directory. Also use when asked to "make a worktree for ABC-58", "set up a branch for this issue", or "create a worktree".
---

# linear-worktree

Creates a git worktree from `main` for a Linear issue as a sibling directory of the current repo.

Copy and track this checklist:

```text
Worktree creation progress:
- [ ] Step 1: Resolve REPO_ROOT / REPO_NAME / REPOS_BASE
- [ ] Step 2: Parse input into ISSUE_ID and BRANCH
- [ ] Step 3: git fetch origin main
- [ ] Step 4: git worktree add at $REPOS_BASE/$REPO_NAME-$ISSUE_ID
- [ ] Step 5: Report worktree path, branch, and cd command with resolved paths
```

## Setup

Resolve three variables:

1. **Inside a git repo** (most common): `REPO_ROOT` = `git rev-parse --show-toplevel`, `REPO_NAME` = its basename, `REPOS_BASE` = its parent directory.
2. **Not inside a git repo but `config.json` has `repos_base`**: use that as `REPOS_BASE`. Ask the user which repo folder.
3. **Neither**: ask for the full repo path.

## Inputs

The user provides one of:

- **Linear URL**: `https://linear.app/myteam/issue/ABC-58/add-dark-mode-toggle`
- **Copy as prompt**: `ABC-58 Add dark mode toggle to settings page`
- **Issue ID only**: `ABC-58`

## Parsing

All parsing produces two values: `ISSUE_ID` (lowercased) and `BRANCH` (id + slug).

### From URL

1. Extract issue ID from the path segment after `/issue/` → `ISSUE_ID` = `abc-58`
2. Last path segment becomes the slug → `BRANCH` = `abc-58-add-dark-mode-toggle`

### From copy as prompt

1. First token is the issue ID → `ISSUE_ID` = `abc-58`
2. Slugify the rest: lowercase, spaces to `-`, strip backticks/parentheses/`...`/quotes/`#`/`@`, collapse consecutive hyphens, trim leading/trailing hyphens
3. `BRANCH` = `abc-58-<slug>`

**Example:** `ABC-58 Add dark mode toggle (don't break "light" default)`
→ `abc-58-add-dark-mode-toggle-dont-break-light-default`

### From issue ID only

Lowercase the ID → `ISSUE_ID` = `abc-58`. Slugify any description the user provides for the branch, otherwise `BRANCH` = `abc-58`.

## Worktree Creation

```bash
git -C $REPO_ROOT fetch origin main

git -C $REPO_ROOT worktree add \
  -b $BRANCH \
  $REPOS_BASE/$REPO_NAME-$ISSUE_ID \
  main
```

This creates a worktree at `$REPOS_BASE/$REPO_NAME-$ISSUE_ID` (e.g. `/Users/you/Code/myrepo-abc-58`) — a sibling of the main repo, not inside it.

## After Creation

Tell the user the worktree path, branch name, and `cd` command using actual resolved paths:

```
Worktree: /Users/you/Code/myrepo-abc-58
Branch:   abc-58-add-dark-mode-toggle
Run:      cd /Users/you/Code/myrepo-abc-58
```

## Edge Cases and Gotchas

- **Branch exists but not checked out**: drop `-b` — use `git worktree add $REPOS_BASE/$REPO_NAME-$ISSUE_ID $BRANCH`.
- **Branch checked out in another worktree**: do not `--force`. Run `git worktree list` and tell the user to `cd` to the existing worktree.
- **Directory already exists**: confirm with user before removing — may be a forgotten worktree.
- **Always fetch first**: `git fetch origin main` before `git worktree add`, or the worktree gets a stale base.
- **Sibling, not child**: worktree path is next to `$REPO_ROOT`, never inside it.
- **"Create a branch" means worktree**: use `git worktree add`, not `git checkout -b`.
- **Always end with `cd`**: the worktree is useless if the user stays in the original repo.
