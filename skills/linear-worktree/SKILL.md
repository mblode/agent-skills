---
name: linear-worktree
description: Creates a git worktree from main for a Linear issue and cd's into it. Use when the user pastes a Linear URL (https://linear.app/.../issue/ABC-58/...), a Linear "copy as prompt" string, or just an issue ID like "ABC-58" or "tig-232". When only an ID is provided, the skill fetches the ticket via the Linear MCP server to derive a descriptive branch slug and load ticket context. After creating the worktree, Claude cd's into it so follow-up work happens in the new directory. Also use when asked to "make a worktree for ABC-58", "set up a branch for this issue", or "create a worktree".
---

# linear-worktree

Creates a git worktree from `main` for a Linear issue as a sibling directory of the current repo, fetches the ticket via Linear MCP when only an ID is given, and `cd`s Claude's session into the new worktree.

Copy and track this checklist:

```text
Worktree creation progress:
- [ ] Step 1: Resolve REPO_ROOT / REPO_NAME / REPOS_BASE
- [ ] Step 2: Parse input into ISSUE_ID (and slug/title if provided inline)
- [ ] Step 3: If only an ID was given, fetch issue via Linear MCP (title + description)
- [ ] Step 4: Derive BRANCH from ISSUE_ID + slug
- [ ] Step 5: git fetch origin main
- [ ] Step 6: git worktree add at $REPOS_BASE/$REPO_NAME-$ISSUE_ID
- [ ] Step 7: cd into the worktree (Bash tool, so subsequent tool calls run there)
- [ ] Step 8: Report worktree path, branch, cd command, and a short ticket summary
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
- **Issue ID only**: `ABC-58` or `tig-232`

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

Lowercase the ID → `ISSUE_ID` = `abc-58`. Then run the MCP lookup below to fetch the title and derive the slug. If MCP is unavailable, `BRANCH` falls back to bare `abc-58`.

## MCP Lookup

Trigger this step when the input is a bare ID, or any time the user wants ticket context loaded.

1. **Pick the first reachable Linear MCP tool.** Try in order:
   - `mcp__claude_ai_Linear__get_issue`
   - `mcp__claude_ai_Linear_2__get_issue`
   - `mcp__linear-server__*` (whichever `get_issue` equivalent it exposes)

   Don't hardcode one — different machines have different servers connected. If the chosen tool is a deferred tool, load it first with `ToolSearch` using `select:<tool_name>`.

2. **Fetch the issue** by its ID (uppercased for the MCP call, e.g. `TIG-232`).

3. **Derive the slug** from the issue title using the same slugify rules as the "copy as prompt" path. `BRANCH` = `<issue-id>-<slug>`.

4. **Capture the description** (plain text, truncated to a few short paragraphs) for the post-setup summary so Claude is primed to work the ticket.

5. **If MCP fails** (no server, auth expired, issue not found): do **not** block worktree creation. Fall back to bare-ID branch (`abc-58`), warn the user clearly, and suggest re-auth (e.g. `/login` for the relevant MCP server) if the cause was an SSO/auth error.

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

1. **`cd` into the worktree via the Bash tool** so Claude's working directory persists for follow-up tool calls:

   ```bash
   cd $REPOS_BASE/$REPO_NAME-$ISSUE_ID
   ```

2. **Print a summary** using resolved paths:

   ```
   Worktree: /Users/you/Code/myrepo-abc-58
   Branch:   abc-58-add-dark-mode-toggle
   Claude is now working in this directory.
   If you exit Claude: cd /Users/you/Code/myrepo-abc-58

   Ticket: ABC-58 — Add dark mode toggle
   <2–4 line description summary>
   ```

   Omit the ticket block if MCP lookup wasn't run or failed.

## Edge Cases and Gotchas

- **Branch exists but not checked out**: drop `-b` — use `git worktree add $REPOS_BASE/$REPO_NAME-$ISSUE_ID $BRANCH`.
- **Branch checked out in another worktree**: do not `--force`. Run `git worktree list` and tell the user to `cd` to the existing worktree.
- **Directory already exists**: confirm with user before removing — may be a forgotten worktree.
- **Always fetch first**: `git fetch origin main` before `git worktree add`, or the worktree gets a stale base.
- **Sibling, not child**: worktree path is next to `$REPO_ROOT`, never inside it.
- **"Create a branch" means worktree**: use `git worktree add`, not `git checkout -b`.
- **Always `cd` via Bash so subsequent tool calls land in the worktree**; also print the path so the user can `cd` in their own shell if they exit Claude.
- **Linear MCP failure is non-blocking**: if no Linear server is connected or auth has expired, fall back to a bare-ID branch and warn — don't abort the worktree.
- **Pick the first reachable Linear MCP server**; do not hardcode a single one. Different machines connect different servers (`claude_ai_Linear`, `claude_ai_Linear_2`, `linear-server`, etc.).
