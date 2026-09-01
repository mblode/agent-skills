---
name: pr-creator
description: >
  Creates or updates a GitHub pull request with a short, human-sounding
  description: Linear issue ID in the title when one exists, title under 60
  chars, one paragraph instead of generated summaries or test-plan sections,
  and a Risk line only when the risk is real. Handles PR templates, draft and
  ready state, reviewers, and gh pr edit when the branch already has a PR.
  Restructures noisy commit history and adds a review path for large diffs.
  Use when asked to "create a PR", "make a PR", "open a pull request", "PR
  this", "ship it", "open as draft", "mark the PR ready", "update the PR
  description", "rewrite the PR title", "make this PR easy to review",
  "polish this PR", "clean up the commits", "squash the fixups", or "split
  this PR". For fixing the code in the diff use tidy; for a read-only bug
  review use pr-reviewer; for CI, conflicts, and review comments after the
  PR exists use pr-babysitter; for npm releases use autoship.
---

# pr-creator

Write PR descriptions like a developer posting in Slack, not an AI summarizing a diff.

- **IS:** creating or updating a GitHub PR's title, body, draft state, and reviewers, plus the commit restructuring and review path that make a large diff readable.
- **IS NOT:** changing the code in the diff (use `tidy`), reviewing it for bugs (use `pr-reviewer`), watching CI and review comments after the PR exists (use `pr-babysitter`), or cutting npm releases (use `autoship`).

## Reference Files

| File | Read When |
|------|-----------|
| `references/pr-polish.md` | Commits contain fixup, WIP, or "address review" noise, the diff exceeds 500 lines, or the user asks to polish, restructure, squash, or split the PR |

## Workflow

Copy this checklist to track progress:

```text
PR creation progress:
- [ ] Inspect: git branch --show-current, git log --oneline origin/main..HEAD, git diff --stat origin/main...HEAD
- [ ] Existing PR? gh pr view --json url,state,isDraft (state OPEN means edit, not create)
- [ ] Linear ID from branch, commits, prompt, or issue link; no ID means no prefix
- [ ] Noisy commits or a >500-line diff? references/pr-polish.md, before pushing
- [ ] PR template present? Read it (paths under Templates)
- [ ] Draft title and body against Rules and Anti-patterns
- [ ] git push -u origin HEAD
- [ ] gh pr create (or gh pr edit); then gh pr view --json url,title and return the URL
```

Do not ask the user to approve the description first; the point is speed. They can ask for a rewrite and you run `gh pr edit`.

## Rules

1. **Title.** With a Linear ID: `ABC-123: Add auth flow`. Without one: `Add auth flow`. Under 60 characters, no trailing period. If the repo lints PR titles (a `semantic-pull-request` or commitlint workflow under `.github/workflows/`), use its shape and put the ID at the end: `feat: add auth flow (ABC-123)`. Linear links on the ID wherever it sits in the title.
2. **Body.** One short paragraph: what changed and why it matters. Length follows the change; a one-line body is fine for a one-line fix.
3. **No fake why.** If the reason is not in the prompt, the Linear issue, the branch, the commits, or the diff, leave it out rather than inventing one.
4. **Risk only when real.** One `Risk:` line for migrations, billing, auth, permissions, irreversible writes, wide blast radius, or a subtle behavior change. Otherwise nothing.
5. **Testing only if real.** Say what you ran only if you ran it. Never a `Test plan` section, never checkboxes.
6. **Partial work.** If this PR does not finish the Linear issue, keep the ID out of the title and write `Part of ABC-123` in the body. Linear's default automation moves a linked issue to Done when the PR merges; the non-closing magic word links without closing.
7. **Draft and reviewers only when asked.** `--draft` for "draft" or "WIP"; `gh pr ready` promotes it later, `gh pr ready --undo` demotes. `--reviewer alice,org/team` only for people the user named; CODEOWNERS already requests owners.
8. **Stop after the useful content.** The harness's `attribution` setting owns the PR footer (`Generated with Claude Code`, session link). Never hand-write one, and never strip one the harness or a repo policy appends. Everything above the footer is this skill's; its one-paragraph body replaces the harness's default `Summary` and `Test plan` sections.

## Anti-patterns: never write these

- Openers that narrate the artifact: "This PR implements...", "This change ensures...", "This commit introduces..."
- Changelog verbs with no reason attached: "Refactored X to improve Y", "Updated Z to handle...", "Added comprehensive test coverage for..."
- Lines that start with a filename or path; the diff already lists the files
- A `Test plan` section with checkboxes
- A bullet list that restates the diff

## Examples

### Feature (`ABC-123` is the real Linear ID)

```text
Title: ABC-123: Add auth flow with session management

Adds the auth flow needed for session-based login, including refresh, timeout handling, and a small error boundary for auth failures.
```

### Bugfix (real risk, real testing)

```text
Title: PAY-482: Dedupe Stripe webhook retries

Stripe retries webhooks on timeout and our handler wasn't idempotent, so retried events created duplicate invoices. Now we record processed event IDs and skip repeats. Tested by replaying a captured retry sequence locally.

Risk: touches the billing write path.
```

### Chore (no Linear ID, no why beyond the diff)

```text
Title: Bump eslint to 9 and fix the new no-unused-vars hits

Bumps eslint to 9. The only code change is removing three unused imports it now flags.
```

The first two carry the real why from the commits and stop. `Risk:` earns its line in the second because the diff touches billing writes; the testing sentence is there only because a replay actually ran. The third has no deeper why, so it does not pretend to.

## Templates

GitHub reads the first match of `pull_request_template.md` (case-insensitive) in `.github/`, the repo root, or `docs/`, or a `PULL_REQUEST_TEMPLATE/` directory in any of those for multiple templates. `gh pr create --body` skips the template entirely, so when one exists, read it and write the body in its shape: keep its headings, answer each in a sentence or two, and put the one-paragraph description under the first heading. Add nothing the template does not ask for.

## Creating the PR

### No PR yet: create

```bash
git push -u origin HEAD   # skip if upstream already set

gh pr create --title "ABC-123: Add auth flow" --body "$(cat <<'EOF'
One short paragraph that explains what changed and why it matters.
EOF
)"

gh pr view --json url,title   # evidence the PR exists; return the url
```

Add `--draft` or `--reviewer` here when Rule 7 applies. `--base` only when the target is not the default branch.

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

- `gh pr create` on a branch with no upstream: in a TTY it blocks on a "Where should we push?" prompt; from a non-interactive harness it aborts with `you must first push the current branch to a remote, or use the --head flag`. Either way, `git push -u origin HEAD` first.
- Non-interactive `gh pr create` needs both `--title` and `--body` (or `--fill`); without them it exits with `must provide --title and --body (or --fill) when not running interactively`. `--fill` copies commit messages verbatim, which is exactly the changelog body this skill exists to avoid.
- Quote the heredoc delimiter (`<<'EOF'`). Unquoted `<<EOF` lets the shell expand backticks and `$vars` in the body, corrupting the description or running commands.
- Two different failures look alike: on the default branch, `gh pr create` aborts with `must be on a branch named differently than "main"`; on a branch with nothing new against the base it fails with `No commits between main and <branch>`. The first needs a branch, the second a commit.
- A branch with an open PR fails `gh pr create` with `a pull request for branch ... into branch main already exists`. `gh pr view --json state` first; `OPEN` means `gh pr edit`. A `MERGED` or `CLOSED` result is a stale PR, so create a new one.
- Derive the Linear ID from the branch, uppercased: Linear's default branch format is `username/abc-123-title-slug`, so `mblode/abc-123-add-auth` gives `ABC-123`. Never guess an ID: Linear links the PR to whatever ID the title contains, and a wrong one moves someone else's issue.
- Plain `git diff` shows only uncommitted changes, so on a committed branch it is empty and the description gets written blind. Diff against the merge base: `git diff origin/main...HEAD` (three dots).
- Restructure commits before the first push. Force-pushing a rewritten branch under an open PR marks existing inline comments "outdated" and the reviewer loses their thread.

## Related skills

- `pr-reviewer`: run before creating to check the diff for bugs.
- `tidy`: applies fixes to the code in the diff; this skill edits only the PR and its commits.
- `pr-babysitter`: hand off after creation to watch CI, conflicts, and review comments.
- `autoship`: npm release pipeline (changesets, version PR, publish); "ship it" without release context routes here instead.
