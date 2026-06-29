---
name: pr-creator
description: >
  Creates GitHub pull requests with short, human-sounding descriptions. Adds a
  Linear issue ID prefix when available, keeps titles under 60 chars, and
  defaults to one short paragraph instead of generated summaries or test-plan
  sections. Restructures noisy commit history into reviewable order and adds
  reviewer guidance for large diffs. Also updates an existing open PR's title
  and description in place with gh pr edit instead of erroring. Use when
  "create a PR", "make a PR", "open a pull request", "PR this", "ship it",
  "update the PR description", "update the PR title", "make this PR easy to
  review", "polish this PR", "tidy the PR", "clean up commits", "restructure
  commits", or "split this PR". For reviewing a diff for bugs, use pr-reviewer. For
  monitoring a PR after creation, use pr-babysitter. For npm releases, use
  autoship.
---

# pr-creator

Write PR descriptions like a developer posting in Slack, not an AI summarizing a diff.

- **IS:** creating or updating a GitHub PR title and body: short human-sounding description, Linear ID prefix, commit restructuring, reviewer guidance for large diffs.
- **IS NOT:** reviewing the diff for bugs (use `pr-reviewer`), watching CI and review comments (use `pr-babysitter`), or cutting npm releases (use `autoship`).

## Reference Files

| File | Read When |
|------|-----------|
| `references/pr-polish.md` | Commits are noisy (fixup, WIP, "address review"), diff exceeds 500 lines, or user asks to polish, tidy, restructure, or split the PR |

## Workflow

Work through this checklist:

```text
PR creation progress:
- [ ] Inspect: git status, git log origin/main..HEAD, git diff origin/main...HEAD
- [ ] Existing PR? gh pr view --json url,number,state (edit, not create, if one exists)
- [ ] Find the Linear ID (branch, commits, prompt, PR context); skip prefix if none
- [ ] Noisy commits or >500-line diff? Read references/pr-polish.md and restructure first
- [ ] Push with upstream: git push -u origin HEAD
- [ ] Draft title and body against the rules and anti-patterns below
- [ ] Check .github/PULL_REQUEST_TEMPLATE.md; fill its sections briefly if present
- [ ] New PR: gh pr create. Existing open PR: gh pr edit. Verify with gh pr view; return the URL
```

Do not ask the user to confirm the description before creating or updating; the point is speed.

## Rules

1. **Title.** With a Linear ID: `ABC-123: Add auth flow`. Without one: `Add auth flow`. Under 60 chars, no trailing period.
2. **Body.** One short paragraph: what changed and why it matters.
3. **No fake why.** If the reason is not in the prompt, Linear issue, branch, commits, or diff, leave it out.
4. **Risk only when real.** One short `Risk:` line only for migrations, billing/auth/permission changes, irreversible writes, wide blast radius, or subtle behavior changes.
5. **Testing only if real.** Mention it only when actually run. Never a `Test plan` section.
6. **No file-by-file changelogs.** The diff already shows the files.
7. **End after the useful content.** No generated-by footer, no co-author line.

## Anti-patterns: never write these

- "This PR implements..."
- "This change ensures..."
- "This commit introduces..."
- "Refactored X to improve Y"
- "Updated the Z component to handle..."
- "Added comprehensive test coverage for..."
- "Ensured backwards compatibility with..."
- Lines that start with a filename or path
- A "Test plan" section with checkboxes
- A long list of bullets that restates the diff

## Before / after examples

### Feature (Linear ID available)

**Bad** (default AI behavior):

```text
Title: Implement user authentication flow with session management and error handling

## Summary
- Added new `AuthProvider` component in `src/components/AuthProvider.tsx`
- Implemented `useAuth` hook for login, logout, and session refresh
- Updated `src/app/layout.tsx` to include the AuthProvider wrapper
- Configured session timeout to 30 minutes with automatic refresh

## Test plan
- [ ] Verify login flow works with valid credentials
- [ ] Verify session persists across page refreshes
```

**Good** (assume `ABC-123` is the real Linear ID):

```text
Title: ABC-123: Add auth flow with session management

Adds the auth flow needed for session-based login, including refresh, timeout handling, and a small error boundary for auth failures.
```

### Bugfix (real risk, real testing)

**Bad:**

```text
Title: Fix issue with duplicate invoice creation in webhook handler

## Summary
This PR addresses an issue where the Stripe webhook handler was not idempotent,
which could result in duplicate invoices under certain retry conditions. The
handler has been updated to track processed event IDs, ensuring retried events
are safely ignored.

## Test plan
- [ ] Verify duplicate webhooks no longer create duplicate invoices
```

**Good:**

```text
Title: PAY-482: Dedupe Stripe webhook retries

Stripe retries webhooks on timeout and our handler wasn't idempotent, so retried events created duplicate invoices. Now we record processed event IDs and skip repeats. Tested by replaying a captured retry sequence locally.

Risk: touches the billing write path.
```

## Creating the PR

Probe for an existing PR first (`gh pr view --json url,number,state`; `state == OPEN` means edit, not create). The heredoc must be quoted (`<<'EOF'`) and the branch needs an upstream: see Gotchas.

### No PR yet: create

```bash
git push -u origin HEAD   # skip if upstream already set

gh pr create --title "ABC-123: Add auth flow" --body "$(cat <<'EOF'
One short paragraph that explains what changed and why it matters.
EOF
)"

gh pr view --json url,title   # evidence the PR exists; return the url
```

### PR already open: update title and body

`gh pr edit` overwrites the title and body wholesale, so draft the full replacement, not a patch. Same rules and anti-patterns apply.

```bash
git push origin HEAD   # push any local commits the PR doesn't have yet

gh pr edit --title "ABC-123: Add auth flow" --body "$(cat <<'EOF'
One short paragraph that explains what changed and why it matters.
EOF
)"

gh pr view --json url,title   # confirm the update; return the url
```

## Gotchas

- `gh pr create` on a branch with no upstream hangs forever on an interactive "Where should we push?" prompt. Run `git push -u origin HEAD` first.
- Quote the heredoc delimiter (`<<'EOF'`). Unquoted `<<EOF` lets the shell expand backticks and `$vars` in the body, corrupting the description or running commands.
- `--body` silently discards `.github/PULL_REQUEST_TEMPLATE.md`. If the template exists, fill its sections with short answers, and do not add sections it does not ask for.
- Derive the Linear ID from the branch (`mblode/abc-123-add-auth` gives `ABC-123`, uppercased). Never guess: Linear's GitHub integration links the PR to whatever ID the title contains.
- `gh pr create` from the default branch fails with "no commits between main and main". Check `git branch --show-current` first.
- `gh pr create` on a branch with an open PR fails with "a pull request for branch ... already exists". Check `gh pr view` first, then switch to `gh pr edit`.
- Plain `git diff` shows only uncommitted changes, so on a committed branch it is empty and the description is written blind. Diff against the merge base: `git diff origin/main...HEAD`.

## Related skills

- `pr-reviewer`: run before creating to check the diff for bugs.
- `pr-babysitter`: hand off after creation to watch CI, conflicts, and review comments.
- `autoship`: npm release pipeline (changesets, version PR, publish); not this skill's job.
