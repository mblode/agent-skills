# PR Mode

Write PR descriptions like a developer posting in Slack, not an AI summarizing a diff. The title and body contract, including the Risk and Proof shape, is in SKILL.md; this file is the rest of it.

## Contents

- Scope of done
- Rules
- Anti-patterns
- Examples
- Templates
- Creating or editing
- Gotchas

## Scope of done

1. Diff against the existing PR's base, or the discovered default branch's merge-base. `gh pr view --json url,state,isDraft,baseRefName`: `OPEN` means edit, not create.
2. Linear ID from the branch, commits, prompt, or issue link.
3. Noisy commits, or `gates` flags the diff as over the review budget: `references/pr-polish.md` before pushing.
4. Read the repo's PR template if one exists.
5. Push, create or edit, and return the URL from `gh pr view --json url,title`.

Do not ask the user to approve the description first; the point is speed. They can ask for a rewrite and you run `gh pr edit`.

## Rules

1. **Linear ID.** Derive it from the branch, uppercased: Linear's default branch format is `username/abc-123-title-slug`, so `mblode/abc-123-add-auth` gives `ABC-123`. Never guess one. A repo that lints PR titles (a `semantic-pull-request` or commitlint workflow under `.github/workflows/`) gets its shape with the ID last: `feat: add auth flow (ABC-123)`. Linear links on the ID wherever it sits in the title.
2. **No fake why.** If the reason is not in the prompt, the Linear issue, the branch, the commits, or the diff, leave it out rather than inventing one.
3. **Input wanted, only when real.** One `Input wanted:` line when a decision in the diff is still open and the reviewer's view would change it. Name the decision, never "thoughts welcome".
4. **Review path, only when the diff spans layers.** One line saying where to start: `Review path: start with migration.sql, then permissions.ts, then the UI.`
5. **Partial work.** If this PR does not finish the Linear issue, keep the ID out of the title and write `Part of ABC-123` in the body. Linear's default automation moves a linked issue to Done when the PR merges; the non-closing phrase links without closing.
6. **Draft and reviewers only when asked.** `--draft` for "draft" or "WIP"; `gh pr ready` promotes it later, `gh pr ready --undo` demotes. `--reviewer alice,org/team` only for people the user named; CODEOWNERS already requests owners.
7. **Size belongs to `gates`.** When it flags the diff as larger than review capacity, split per `references/pr-polish.md`, or say in one line why the change cannot be split.
8. **Stop after the useful content.** The harness's attribution setting owns the PR footer (`Generated with Claude Code`, session link). Never hand-write one, and never strip one the harness or a repo policy appends. Everything above the footer is this skill's; the paragraph plus Risk and Proof replace the harness's default `Summary` and `Test plan` sections.

## Anti-patterns

- Openers that narrate the artifact: "This PR implements...", "This change ensures..."
- Changelog verbs with no reason attached: "Refactored X to improve Y", "Added comprehensive test coverage for..."
- Lines that start with a filename or path; the diff already lists the files
- A `Test plan` section with checkboxes, or a Proof line naming a command nobody ran
- A bullet list that restates the diff
- A body where the point is not in the first sentence: that is a summary, not a description

## Examples

### Feature (`ABC-123` is the real Linear ID)

```text
Title: ABC-123: Add auth flow with session management

Adds the auth flow needed for session-based login, including refresh, timeout handling, and a small error boundary for auth failures.

Input wanted: the 15-minute idle timeout is a guess; if product has a number, I'll use it.

## Risk
- Blast radius: a refresh bug logs every user out at the 15-minute mark.
- Touches: auth
- Rollback: revert

## Proof
- `npm test -- --run src/auth` -> 38 passed, including expiry and refresh
- `npm run typecheck` -> no errors
- Evidence level: fresh tests
- Not verified: e2e login, needs staging credentials
```

### Bugfix (billing write path)

```text
Title: PAY-482: Dedupe Stripe webhook retries

Stripe retries webhooks on timeout and our handler wasn't idempotent, so retried events created duplicate invoices. Now we record processed event IDs and skip repeats.

## Risk
- Blast radius: a bad idempotency key would drop a first delivery instead of a retry.
- Touches: money
- Rollback: revert

## Proof
- Replayed a captured three-retry sequence against the local handler -> one invoice created
- `npm test -- --run webhooks` -> 14 passed
- Evidence level: runtime startup
```

### Chore (no Linear ID, no why beyond the diff)

```text
Title: Bump eslint to 9 and fix the new no-unused-vars hits

Bumps eslint to 9. The only code change is removing three unused imports it now flags.

## Risk
- Blast radius: lint only; no runtime code changes beyond three deleted imports.
- Touches: none
- Rollback: revert

## Proof
- `npm run lint` -> 0 problems
- Evidence level: fresh tests
```

Each carries the real why from the commits and stops. `Input wanted:` earns its line in the first because the timeout is a decision the reviewer can change. The third has no deeper why, so it does not pretend to.

## Templates

GitHub reads the first match of `pull_request_template.md` (case-insensitive) in `.github/`, the repo root, or `docs/`, or a `PULL_REQUEST_TEMPLATE/` directory in any of those. `gh pr create --body` skips the template entirely, so when one exists, write the body in its shape: keep its headings, answer each in a sentence or two, and put the paragraph under the first heading. Proof's bullets go under the template's testing or validation heading when it has one, and Risk's under its risk heading; whatever has no matching heading follows the last one as `## Risk` or `## Proof`. Add nothing else the template does not ask for.

## Creating or editing

Write the exact body to a temporary file with the file tool, then pass it through `--body-file`. The examples use `/tmp/pr-body.md`; choose a task-specific path.

```bash
git push -u origin HEAD
gh pr create --title "ABC-123: Add auth flow" --body-file /tmp/pr-body.md
gh pr view --json url,title   # evidence the PR exists; return the url
```

Add `--draft` or `--reviewer` when rule 6 applies, and `--base` only when the target is not the default branch.

`gh pr edit` overwrites the title and body wholesale, so draft the full replacement, not a patch. A metadata-only edit does not push local commits: an unpushed experimental commit stays local.

```bash
gh pr edit --title "ABC-123: Add auth flow" --body-file /tmp/pr-body.md
gh pr view --json url,title
```

## Gotchas

- `gh pr create` on a branch with no upstream blocks on a "Where should we push?" prompt in a TTY and aborts non-interactively with `you must first push the current branch to a remote, or use the --head flag`. Push first.
- Non-interactive `gh pr create` needs `--title` and `--body` (or `--fill`). `--fill` copies commit messages verbatim, which is the changelog body this mode exists to avoid.
- Quote a heredoc delimiter (`<<'EOF'`) if you use one: unquoted, the shell expands backticks and `$vars` in the body.
- On the default branch `gh pr create` aborts with `must be on a branch named differently than "main"`; with nothing new against the base it fails with `No commits between main and <branch>`. The first needs a branch, the second a commit.
- `a pull request for branch ... already exists` means `gh pr edit`. A `MERGED` or `CLOSED` PR on the branch is stale; create a new one.
- Plain `git diff` omits committed changes. Use the PR base with a three-dot diff; do not assume `main`, especially for stacked PRs.
