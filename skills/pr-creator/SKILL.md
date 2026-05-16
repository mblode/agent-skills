---
name: pr-creator
description: >
  Creates GitHub pull requests with short, human-sounding descriptions instead of
  verbose AI-generated summaries. Enforces imperative titles under 60 chars and
  2-5 plain bullet points with no test plan sections or file-by-file changelogs.
  Use when "create a PR", "make a PR", "open a pull request", "PR this", or "ship it".
---

# pr-creator

Write PR descriptions like a developer posting in Slack, not like an AI summarizing a diff.

## Rules

1. **Title**: short imperative, under 60 chars, sentence case. No periods.
2. **Body**: 2-5 bullet points. Each bullet is one line. No sub-bullets.
3. **No sections.** No `## Summary`, no `## Test plan`, no `## Changes`, no headers at all.
4. **No file-by-file changelogs.** Never list which files were touched.
5. **No corporate AI tone.** See anti-patterns below.
6. **Testing goes in a bullet** if worth mentioning — "tested with X" or "verified Y works". Not a section.
7. **End with the co-author line**, nothing else after it.

## Anti-patterns — never write these

- "This PR implements..."
- "This change ensures..."
- "This commit introduces..."
- "Refactored X to improve Y"
- "Updated the Z component to handle..."
- "Added comprehensive test coverage for..."
- "Ensured backwards compatibility with..."
- Bullet points that start with a filename or path
- A "Test plan" section with checkboxes
- More than 5 bullet points

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
Title: Add auth flow with session management

- Auth context provider with login/logout/refresh
- Sessions timeout after 30 min and auto-refresh
- Error boundary catches auth failures
```

## Command

After analyzing the diff and drafting the title and body, create the PR:

```bash
gh pr create --title "the title here" --body "$(cat <<'EOF'
- first bullet
- second bullet
- third bullet if needed

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

## Workflow

1. Run `git status`, `git diff`, and `git log` to understand the changes.
2. Push with `-u` if the branch has no upstream.
3. Draft title and body following the rules above.
4. Create the PR with `gh pr create`.
5. Return the PR URL.

Do not ask the user to confirm the description before creating. The whole point is speed.
