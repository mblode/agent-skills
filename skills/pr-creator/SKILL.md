---
name: pr-creator
description: >
  Creates GitHub pull requests with short, human-sounding descriptions. Adds a
  Linear issue ID prefix when available, keeps titles under 60 chars, and
  defaults to one short paragraph instead of generated summaries or test-plan
  sections. Restructures noisy commit history into reviewable order and adds
  reviewer guidance for large diffs. Use when "create a PR", "make a PR",
  "open a pull request", "PR this", "ship it", "make this PR easy to review",
  "polish this PR", "tidy the PR", "clean up commits", "restructure commits",
  or "split this PR". For reviewing a diff for bugs, use pr-reviewer. For
  monitoring a PR after creation, use pr-babysitter. For npm releases, use
  autoship.
---

# pr-creator

Write PR descriptions like a developer posting in Slack, not like an AI summarizing a diff.

- **IS:** creating the GitHub PR: a short human-sounding description, a Linear ID title prefix, commit restructuring, and reviewer guidance for large diffs.
- **IS NOT:** reviewing the diff for bugs (use `pr-reviewer`), watching CI and review comments after creation (use `pr-babysitter`), or cutting npm releases (use `autoship`).

## Reference Files

| File | Read When |
|------|-----------|
| `references/pr-polish.md` | Commit history is noisy (fixup, WIP, or "address review" commits), the diff exceeds 500 lines, or the user asks to polish, tidy, restructure, or split the PR |

## Workflow

Copy this checklist and work through it:

```text
PR creation progress:
- [ ] Inspect: git status, git log origin/main..HEAD, git diff origin/main...HEAD
- [ ] Find the Linear ID (branch, commits, prompt, PR context); skip the prefix if none
- [ ] Noisy commits or >500-line diff? Read references/pr-polish.md and restructure first
- [ ] Push with upstream: git push -u origin HEAD
- [ ] Draft title and body against the rules and anti-pattern list below
- [ ] Check for .github/PULL_REQUEST_TEMPLATE.md; fill its sections briefly if present
- [ ] Create with gh pr create; verify with gh pr view; return the URL
```

Do not ask the user to confirm the description before creating. The whole point is speed.

## Rules

1. **Title.** With a Linear ID: `ABC-123: Add auth flow`. Without one: `Add auth flow`. Under 60 chars, no trailing period.
2. **Body.** Default to one short paragraph: what changed and why it matters.
3. **No fake why.** If the reason is not in the prompt, Linear issue, branch, commits, or diff, leave it out.
4. **Risk only when real.** Add one short `Risk:` line only for migrations, billing/auth/permission changes, irreversible writes, wide blast radius, or subtle behavior changes.
5. **Testing only if real.** Mention testing only when it was actually run. Never a `Test plan` section.
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

### Refactor (no Linear ID)

**Bad:**

```text
Title: Refactor data fetching utilities to improve maintainability

This commit introduces a unified retry mechanism, refactoring the existing
data fetching utilities to leverage a shared helper. This ensures consistency
across the codebase and improves long-term maintainability.
```

**Good:**

```text
Title: Collapse three copies of fetch retry logic into one helper

Same retry behavior we had in three places, now in one withRetry helper. No behavior change.
```

## Creating the PR

```bash
git push -u origin HEAD   # skip if upstream already set

gh pr create --title "ABC-123: Add auth flow" --body "$(cat <<'EOF'
One short paragraph that explains what changed and why it matters.
EOF
)"

gh pr view --json url,title   # evidence the PR exists; return the url
```

## Gotchas

- `gh pr create` on a branch with no upstream hangs on an interactive "Where should we push?" prompt; agents stall there forever. Run `git push -u origin HEAD` first.
- Quote the heredoc delimiter (`<<'EOF'`). With an unquoted `<<EOF` the shell expands backticks and `$vars` inside the body, corrupting the description or executing commands.
- `--body` silently discards `.github/PULL_REQUEST_TEMPLATE.md`. If the template exists, fill its sections with short answers instead of ignoring it, and do not add sections it does not ask for.
- Derive the Linear ID from the branch name (`mblode/abc-123-add-auth` gives `ABC-123`, uppercased). Never guess one: Linear's GitHub integration links the PR to whatever ID the title contains.
- `gh pr create` from the default branch fails with "no commits between main and main". Check `git branch --show-current` during inspection.
- Plain `git diff` shows only uncommitted changes, so on a committed branch it is empty and the description will be written blind. Diff against the merge base: `git diff origin/main...HEAD`.

## Related skills

- `pr-reviewer`: run before creating when the user wants the diff checked for bugs.
- `pr-babysitter`: hand off after creation to watch CI, conflicts, and review comments.
- `autoship`: npm release pipeline (changesets, version PR, publish); not this skill's job.
