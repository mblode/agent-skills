---
name: linear-worktree
description: Creates a sibling git worktree and local branch for a Linear issue from the repo's default branch. Fetches Linear issue context when a connector or MCP issue lookup tool is available, derives or validates a Git-safe branch name, and prints a ticket-first summary with worktree path and branch. Use when the user pastes a Linear issue URL, Linear copy-as-prompt text, an issue ID like "ABC-58" or "tig-232", or asks "make a worktree", "set up a branch", or "start work on this Linear issue".
---

# linear-worktree

Create or reuse a sibling git worktree for a Linear issue. The workflow must leave clear evidence: the resolved ticket, branch, worktree path, and successful git verification.

## Reference Files

| File | Read When |
| --- | --- |
| `references/worktree-procedure.md` | Always before creating or reusing a worktree; contains default-branch detection, Linear lookup, branch validation, idempotency, summary format, and evaluation scenarios. |

## Required Workflow

Load `references/worktree-procedure.md` before any git mutation. Then copy and track this checklist:

```text
Worktree creation progress:
- [ ] Step 1: Resolve REPO_ROOT / REPO_NAME / REPOS_BASE
- [ ] Step 2: Resolve DEFAULT_BRANCH and fetched BASE_REF
- [ ] Step 3: Parse input into ISSUE_ID and candidate slug
- [ ] Step 4: Fetch Linear issue context when an issue lookup tool is reachable
- [ ] Step 5: Derive or validate BRANCH, then run git check-ref-format
- [ ] Step 6: Set WORKTREE_PATH and precheck existing worktrees, local branch, and remote branch
- [ ] Step 7: Fetch BASE_REF and create or reuse the worktree
- [ ] Step 8: Verify worktree path and checked-out branch with git -C
- [ ] Step 9: Best-effort cmux rename when cmux is available
- [ ] Step 10: Print ticket-first summary ending with Worktree and Branch
```

## Non-Negotiables

- Do not create from stale local `main` or local `$DEFAULT_BRANCH`; use verified `BASE_REF=refs/remotes/origin/$DEFAULT_BRANCH`.
- Do not trust title text as a branch; slugify with the allowlist and run `git check-ref-format --branch`.
- Do not re-run `worktree add` blindly; inspect `git worktree list --porcelain` and reuse/report existing worktrees.
- Do not hardcode generated Linear MCP binding names; discover the available Linear issue lookup tool in the active environment.
- Do not assume `cd` persisted; use tool workdir, `git -C`, or `cd "$WORKTREE_PATH" && ...`.

## Exit Evidence

Before reporting success, verify:

```bash
git -C "$WORKTREE_PATH" rev-parse --show-toplevel
git -C "$WORKTREE_PATH" rev-parse --abbrev-ref HEAD
git -C "$WORKTREE_PATH" status --short --branch
```

The reported toplevel must equal `WORKTREE_PATH`, and the branch must equal `BRANCH`.
