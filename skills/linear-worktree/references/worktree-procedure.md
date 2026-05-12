# Worktree Procedure

## Contents

- Setup
- Default branch
- Inputs
- Linear lookup
- Branch slugging
- Worktree creation
- After creation
- Summary
- Edge cases and gotchas
- Evaluation scenarios

## Setup

Resolve these variables before parsing branch state:

- `CURRENT_REPO_ROOT`: `git rev-parse --show-toplevel` when inside any worktree.
- `REPO_ROOT`: the canonical main worktree. If inside a git repo, derive it from the first record in `git -C "$CURRENT_REPO_ROOT" worktree list --porcelain`; fall back to `CURRENT_REPO_ROOT` if that command is unavailable.
- `REPO_NAME`: basename of `REPO_ROOT`.
- `REPOS_BASE`: dirname of `REPO_ROOT`.

Resolve `WORKTREE_PATH="$REPOS_BASE/$REPO_NAME-$ISSUE_ID"` after parsing `ISSUE_ID`.

Use this shape when inside a git repo:

```bash
CURRENT_REPO_ROOT="$(git rev-parse --show-toplevel)"
MAIN_WORKTREE="$(git -C "$CURRENT_REPO_ROOT" worktree list --porcelain | sed -n '1s/^worktree //p')"
REPO_ROOT="${MAIN_WORKTREE:-$CURRENT_REPO_ROOT}"
REPO_NAME="$(basename "$REPO_ROOT")"
REPOS_BASE="$(dirname "$REPO_ROOT")"
```

If not inside a git repo, read this skill folder's `config.json` when available:

```json
{
  "repos_base": "/Users/you/Code/linktree",
  "default_repo": "frontyard"
}
```

- If both values are set, `REPO_ROOT="$repos_base/$default_repo"`.
- If only `repos_base` is set, ask which repo folder to use.
- If neither is set, ask for the full repo path.

## Default Branch

Detect the default branch; do not assume `main`.

```bash
DEFAULT_BRANCH="$(
  git -C "$REPO_ROOT" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null \
    | sed 's@^origin/@@'
)"
```

If that is empty:

1. Try `git -C "$REPO_ROOT" ls-remote --symref origin HEAD` and parse `refs/heads/<branch>`.
2. Look for remote branches in this order: `origin/main`, `origin/master`, `origin/develop`, `origin/trunk`.
3. If still unresolved, ask the user. Stop before fetching or creating a worktree.

Fetch and verify the base ref before `worktree add`:

```bash
BASE_REF="refs/remotes/origin/$DEFAULT_BRANCH"
git -C "$REPO_ROOT" fetch origin "+refs/heads/$DEFAULT_BRANCH:$BASE_REF"
git -C "$REPO_ROOT" rev-parse --verify "$BASE_REF^{commit}" >/dev/null
```

If fetch or verification fails, abort and surface the git error. Do not create a branch from stale local `$DEFAULT_BRANCH`.

## Inputs

The user provides one of:

- Linear URL: `https://linear.app/myteam/issue/ABC-58/add-dark-mode-toggle`
- Copy as prompt: `ABC-58 Add dark mode toggle to settings page`
- Issue ID only: `ABC-58` or `tig-232`

Parsing always produces:

- `ISSUE_ID`: lowercased issue identifier, e.g. `abc-58`
- `DISPLAY_ID`: uppercased issue identifier for Linear lookup and summary, e.g. `ABC-58`
- candidate slug: optional text from URL path, copy prompt, or Linear title

From a URL, strip query/fragment text, extract the path segment immediately after `/issue/` as `ISSUE_ID`, and use the final path segment as the candidate slug when it is not the issue ID.

From copy-as-prompt text, the first token is `ISSUE_ID`; the rest is the candidate slug.

From issue ID only, the candidate slug comes from Linear lookup when available.

## Linear Lookup

Always attempt a Linear issue lookup when a reachable connector or MCP tool exists, even when the input already includes a slug. The lookup supplies the canonical URL, title, description, and sometimes Linear's generated git branch name.

Use the active environment's tool discovery instead of hardcoding generated tool IDs:

- Search for a Linear issue lookup tool that accepts an issue ID and returns issue details, such as `Linear:get_issue` or a Linear app issue fetch tool.
- Prefer a direct "get issue by ID" tool. If only a broader Linear search/research tool exists, use it only when it can retrieve the specific issue by `DISPLAY_ID`.
- Use the fully qualified tool name exposed by the current environment. Do not write raw generated MCP binding names into commands or docs.
- If no tool is reachable, auth fails, or the issue is not found, continue with URL/copy-prompt context. Tell the user Linear context was unavailable and use the auth flow shown by the current environment; do not prescribe a provider-specific login command unless the environment explicitly presents one.

If lookup succeeds, capture:

- `url`: Linear issue URL for the summary.
- `title`: preferred source for the slug.
- `description`: plain text trimmed to 2-3 short lines; use `No description.` if empty.
- `gitBranchName` / `branchName` / equivalent branch field when present.

Branch source priority:

1. Use Linear's returned branch name when it contains the issue ID and passes `git check-ref-format --branch` after trimming a leading `refs/heads/`.
2. Otherwise derive `BRANCH` from `ISSUE_ID` plus slugified Linear title.
3. Otherwise derive from URL/copy-prompt slug.
4. Otherwise use bare `ISSUE_ID`.

## Branch Slugging

Use one slugifier for URL slugs, copy-prompt text, and Linear titles:

1. Lowercase.
2. Remove apostrophes/backticks.
3. Replace every run of characters outside `[a-z0-9]` with `-`.
4. Collapse consecutive hyphens.
5. Trim leading/trailing hyphens.
6. Cap the slug at 50 characters, preferably at the last hyphen boundary at or before 50. If that would produce an empty slug, use the first 50 characters after trimming hyphens.

Build the branch:

- With slug: `BRANCH="$ISSUE_ID-$SLUG"`
- Without slug: `BRANCH="$ISSUE_ID"`

Validate before any git mutation:

```bash
git -C "$REPO_ROOT" check-ref-format --branch "$BRANCH"
```

If validation fails, stop and ask the user for a branch suffix.

## Worktree Creation

Precheck before adding anything:

1. Set `WORKTREE_PATH="$REPOS_BASE/$REPO_NAME-$ISSUE_ID"`.
2. Inspect `git -C "$REPO_ROOT" worktree list --porcelain`.
3. If `WORKTREE_PATH` is already a registered worktree for `refs/heads/$BRANCH`, reuse it and skip `worktree add`.
4. If `WORKTREE_PATH` is registered for a different branch, abort and show that branch.
5. If `BRANCH` is checked out in another worktree, abort and show that path. Do not use `--force`.
6. If `WORKTREE_PATH` exists on disk but is not the expected registered worktree, ask before moving or deleting anything.
7. If local `refs/heads/$BRANCH` exists and is not checked out elsewhere, add the worktree from that branch.
8. Else if `refs/remotes/origin/$BRANCH` exists, create a local tracking branch from it.
9. Else create a new branch from verified `BASE_REF`.

Command shapes:

```bash
if git -C "$REPO_ROOT" show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git -C "$REPO_ROOT" worktree add "$WORKTREE_PATH" "$BRANCH"
elif git -C "$REPO_ROOT" show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
  git -C "$REPO_ROOT" worktree add --track -b "$BRANCH" "$WORKTREE_PATH" "origin/$BRANCH"
else
  git -C "$REPO_ROOT" worktree add -b "$BRANCH" "$WORKTREE_PATH" "$BASE_REF"
fi
```

Verify exit codes. If `git worktree add` fails, abort and surface the git error verbatim. Do not proceed to cmux rename or success summary.

## After Creation

Do not assume `cd` persists across shell calls or changes the user's terminal. Treat `WORKTREE_PATH` as the durable result.

For follow-up commands, use the execution mechanism that the current harness supports:

- Prefer a tool-level working directory set to `WORKTREE_PATH`.
- For git commands, use `git -C "$WORKTREE_PATH" ...`.
- For shell commands without a workdir option, prefix with `cd "$WORKTREE_PATH" && ...`.

Verify the worktree:

```bash
git -C "$WORKTREE_PATH" rev-parse --show-toplevel
git -C "$WORKTREE_PATH" rev-parse --abbrev-ref HEAD
git -C "$WORKTREE_PATH" status --short --branch
```

The reported toplevel must equal `WORKTREE_PATH`, and the branch must equal `BRANCH`.

Best-effort cmux rename after verification:

```bash
command -v cmux >/dev/null && \
  cmux workspace-action --action rename --title "$ISSUE_ID" >/dev/null 2>&1 \
  || true
```

Silently skip cmux failures. This is cosmetic.

## Summary

Lead with ticket context and end with code location. No decorative lines.

Linear lookup succeeded:

```text
ABC-58 - Add dark mode toggle
https://linear.app/myteam/issue/ABC-58

<2-3 line description, or "No description." if blank>

Worktree: /Users/you/Code/linktree/frontyard-abc-58
Branch:   abc-58-add-dark-mode-toggle
```

Linear lookup failed:

```text
ABC-58
Linear context unavailable: <brief reason>.

Worktree: /Users/you/Code/linktree/frontyard-abc-58
Branch:   abc-58-add-dark-mode-toggle
```

Do not include harness notes, duplicate `cd` lines, status/assignee/team metadata, or claims that the agent changed the user's terminal directory.

The branch is local-only unless it reused `origin/$BRANCH`. When ready to push a new branch: `git push -u origin "$BRANCH"`.

## Edge Cases and Gotchas

- Branch already exists locally: reuse it only if it is not checked out in another worktree.
- Remote branch already exists: create a local tracking branch from `origin/$BRANCH`; do not create a divergent local branch from default.
- Branch checked out elsewhere: report the existing worktree path and stop.
- Directory already exists: confirm before removing or moving; it may be a forgotten worktree.
- Existing linked worktree invocation: derive `REPO_NAME` from the canonical main worktree, not the linked worktree folder.
- Linear failure is non-blocking: fall back to available URL/copy-prompt slug or bare issue ID.
- cmux rename is best-effort only and must never block setup.
- Summary stays high-signal: ticket first, worktree and branch last.

## Evaluation Scenarios

Use these scenarios when changing this skill:

- Bare issue ID, Linear succeeds, local default branch is stale: new branch starts from latest `origin/<default>`.
- `origin/HEAD` is unset and the default branch is `trunk`: skill finds `origin/trunk` or asks instead of assuming `main`.
- Copy prompt includes `/`, `:`, `?`, brackets, emoji, quotes, and a long title: final branch passes `git check-ref-format --branch`.
- `origin/$BRANCH` exists but local `$BRANCH` does not: skill creates a local tracking branch from remote.
- Desired worktree path already exists as the correct worktree: skill reuses it and still prints verification.
- Desired branch is checked out in another worktree: skill reports that path and stops.
- Linear is unavailable for URL, copy-prompt, and bare-ID inputs: fallback branch and summary preserve all available context.
- Shell cwd resets between calls: subsequent commands still target `WORKTREE_PATH`.
