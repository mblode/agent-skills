---
name: pr-creator
description: >
  Creates GitHub pull requests with short, human-sounding descriptions. Adds a
  Linear issue ID prefix when available, keeps titles under 60 chars, and
  defaults to one useful paragraph instead of generated summaries or test-plan
  sections. Use when "create a PR", "make a PR", "open a pull request", "PR
  this", or "ship it".
---

# pr-creator

Write PR descriptions like a developer posting in Slack, not like an AI summarizing a diff.

## Rules

1. **Title**: use `TIG-271: Add auth flow` when a Linear ID is available. Otherwise use `Add auth flow`. Keep it under 60 chars. No periods.
2. **Body**: default to one short paragraph. Explain what changed and why it matters.
3. **No fake why.** If the reason is not clear from the prompt, Linear issue, branch, commits, or diff, leave it out.
4. **Risk only when real.** Add one short `Risk:` line only for migrations, billing/auth/permission changes, irreversible writes, wide blast radius, or subtle behavior changes.
5. **Testing only if real.** Mention testing only when it was actually run. No `Test plan` section.
6. **No file-by-file changelogs.** The diff already shows the files.
7. **End after the useful content.** No generated-by footer or co-author line.

## Anti-patterns — never write these

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

## Before / after

**Bad** (default AI behavior):

```text
Title: Implement user authentication flow with session management and error handling

## Summary
- Added new `AuthProvider` component in `src/components/AuthProvider.tsx`
  that wraps the application with authentication context
- Implemented `useAuth` hook in `src/hooks/useAuth.ts` for login, logout,
  and session refresh functionality
- Updated `src/app/layout.tsx` to include the AuthProvider wrapper
- Added error boundary handling for authentication failures
- Configured session timeout to 30 minutes with automatic refresh

## Test plan
- [ ] Verify login flow works with valid credentials
- [ ] Verify login flow shows error with invalid credentials
- [ ] Verify session persists across page refreshes
- [ ] Verify automatic logout after 30 minutes of inactivity
- [ ] Verify the auth error boundary catches and displays auth failures
```

**Good** (what this skill produces):

```text
Title: TIG-271: Add auth flow with session management

Adds the auth flow needed for session-based login, including refresh, timeout handling, and a small error boundary for auth failures.
```

## Command

After analyzing the diff and drafting the title and body, create the PR:

```bash
gh pr create --title "TIG-271: the title here" --body "$(cat <<'EOF'
One short paragraph that explains what changed and why it matters.
EOF
)"
```

## Workflow

1. Run `git status`, `git diff`, and `git log` to understand the changes.
2. Find a Linear ID like `ABC-123` in the branch, commits, prompt, or PR context. If none exists, leave it out.
3. Push with `-u` if the branch has no upstream.
4. Draft title and body following the rules above.
5. If the repo has a PR template, respect it, but keep each answer short and do not add extra sections.
6. Create the PR with `gh pr create`.
7. Return the PR URL.

Do not ask the user to confirm the description before creating. The whole point is speed.
