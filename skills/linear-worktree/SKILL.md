---
name: linear-worktree
description: Creates a git worktree from main for a Linear issue. Use when the user pastes a Linear URL (https://linear.app/.../issue/ABC-58/...), a Linear "copy as prompt" string, or just an issue ID like "ABC-58". Handles URL parsing, branch name derivation, repo disambiguation, and worktree creation. Also use when asked to "make a worktree for ABC-58", "set up a branch for this issue", or "create a worktree".
---

# linear-worktree

Creates a git worktree from `main` for a Linear issue at `<repos_base>/<repo>-<id>`.

## Setup

Check `config.json` for `repos_base` (default: `~/Code`). If the user's repos live elsewhere, ask and update it.

## Inputs

The user provides one of:

- **Linear URL**: `https://linear.app/myteam/issue/ABC-58/change-placeholder-on-input`
- **Copy as prompt**: `ABC-58 Change placeholder on input to \`Ask Linktree...\``
- **Issue ID only**: `ABC-58` (plus context from conversation)

## Parsing

### From URL

1. Extract issue ID from the URL path segment (e.g. `ABC-58` → `abc-58`)
2. Use the URL's last path segment as the branch slug (e.g. `change-placeholder-on-input`)
3. Branch name: `<id>-<slug>` → `abc-58-change-placeholder-on-input`

### From copy as prompt

1. Extract issue ID as the first token (e.g. `ABC-58` → `abc-58`)
2. Slugify the remaining title:
   - Lowercase everything
   - Replace spaces with `-`
   - Strip special characters: backticks, parentheses, `...`, quotes, `#`, `@`
   - Replace multiple consecutive hyphens with a single `-`
   - Remove leading/trailing hyphens
3. Branch name: `<id>-<slugified-title>`

**Example:** `ABC-58 Change placeholder to \`Ask Linktree...\` (don't mention "coach")`
→ `abc-58-change-placeholder-to-ask-linktree-dont-mention-coach`

## Repo Disambiguation

Infer from context:
- Current working directory inside a known repo → use that repo name
- Component or area mentioned in the issue → map to the relevant repo

**If unclear, ask**: "Which repo? (e.g. frontend, backend, monorepo)"

## Worktree Creation

```bash
# Fetch latest main first
git -C <repos_base>/<repo> fetch origin main

# Create worktree with new branch from main
git -C <repos_base>/<repo> worktree add \
  -b <branch-name> \
  <repos_base>/<repo>-<id> \
  main
```

- **Worktree path**: `<repos_base>/<repo>-<id>` (e.g. `~/Code/<repo>-abc-58`)
- **Branch**: `<id>-<slug>` (e.g. `abc-58-change-placeholder-on-...`)
- **Base**: always `main`

## After Creation

Tell the user:
1. Worktree path: `<repos_base>/<repo>-<id>`
2. Branch name
3. Navigate: `cd <repos_base>/<repo>-<id>`

## Edge Cases

- **Branch already exists (not checked out elsewhere)**: Drop the `-b` flag — use `git worktree add <path> <branch>` to check out the existing branch into the new worktree.
- **Branch already checked out in another worktree**: Do not use `--force`. Run `git worktree list` to find the existing worktree and tell the user to use that path instead.
- **Directory already exists**: Same failure mode — confirm with user before removing.
- **Slug is very long**: Git branch names have no practical length limit, but keep the full slug to preserve traceability to Linear.
