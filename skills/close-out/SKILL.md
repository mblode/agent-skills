---
name: close-out
description: Folds what a finished change decided into the repository's existing docs by rewriting them to the current state, so the next agent reads only what is true now. Covers AGENTS.md files, docs, specs, and why-comments, and holds the instruction-file size budget. Use when wrapping up a task or before a PR, or when asked to "close this out", "update the docs for this change", "write down why we did this", or "record this decision".
---

# Close-out

At the end of a change, the reasoning lives in the conversation, the plan, and the review threads, and all three disappear. Keep the part the next agent needs by rewriting the files it will read anyway, so they describe the system as it is after this change.

- **IS:** syncing repository docs with a finished change: finding each passage the change made false or incomplete, rewriting it in place, deleting what no longer holds, and keeping instruction files inside their budget.
- **IS NOT:** auditing or restructuring a whole instruction file (`agents-md`), writing new human-facing docs or READMEs (`ghostwriter`), recovering decisions from past sessions (`chat-history`), or the PR description (`pr-creator`).

## Current State, Not History

Docs say what is true now. An agent reads a superseded decision as a live one and anchors on it, and a record marked "superseded" still gets read first.

- When a decision changes, rewrite the passage that states it. Never append a new entry beside the old one.
- Write no decision logs, ADR folders, dated entries, or "Update:" paragraphs. Keep "previously", "we used to", "as of", "now", "no longer" and "changed in #123" out of the text: each one dates the sentence, and the next change makes it wrong.
- Keep a reason when it prevents a mistake ("writes go through the queue because the provider rate-limits at 10 per second"). Drop how the team arrived at it.
- History belongs in git: the commit message and PR body hold the story, `git log -S` finds it on request, and nothing loads it by default.

A repository may already keep an ADR folder or a decision log. Do not add to it. Rewrite the current-state doc, then report each record the change contradicts and propose deleting or rewriting it. Delete another author's records only with the user's yes, because the folder may be team policy. A release `CHANGELOG.md` written by changesets or other release tooling is user-facing release notes: leave it to that tooling.

## Workflow

```text
Close-out progress:
- [ ] Step 1: Collect what the change decided
- [ ] Step 2: Find each passage it affects
- [ ] Step 3: Rewrite in place
- [ ] Step 4: Hold the budget
- [ ] Step 5: Verify, commit with the change, report
```

### Step 1: Collect what the change decided

Read the diff against its base (`git diff --stat <base>...HEAD`, then the files that matter), the commit messages, the review threads, and any plan or task file the work ran from, including its decisions and deviations sections. Plan files often live in git-excluded folders such as `.captain/` or scratch directories; mine them here, because they go away with the worktree.

Keep a decision only when an agent reading the code and the current docs would make a wrong move without it: a constraint, an approach chosen over the obvious alternative, an invariant, a new or removed command, or something deleted that an agent will try to bring back. Skip what the code already says plainly. A change can end with nothing worth writing, and saying so is a valid close-out.

### Step 2: Find each passage it affects

Search for what the change touched: old and new names, paths, commands, and the approach it replaced.

```bash
rg -n --glob '*.md' -e '<old-name>' -e '<path>' -e '<old-command>'
```

Include nested `AGENTS.md` files, `docs/`, spec folders, developer sections of READMEs, the repo's own skills, and why-comments in the changed modules. Each fact gets one home, the place an agent reads when it touches that code:

| Knowledge | Home |
|---|---|
| A rule every task in the repo needs | Root `AGENTS.md` |
| A rule for one directory or package | `AGENTS.md` in that directory |
| Why a few lines are written this way | A comment beside those lines |
| Why a module is shaped this way | The module's own doc, or the docs page that already covers it |
| A repeated procedure | The skill or script that already runs it |
| Product behaviour | The spec the repo already keeps |
| The story of how it was decided | The commit message or PR body only |

### Step 3: Rewrite in place

Edit each passage so it reads as if it had always been this way. Delete statements the change made false, including mentions of removed files and commands. Where a fact appears in two places, keep its home from the table and replace the other copy with a pointer or delete it. Create a new file only when no existing file covers the area, and put it where the agent will read it, usually a nested `AGENTS.md` beside the code.

These are version-controlled files in the working tree and git keeps the old text, so rewrite and delete freely inside the change's area without asking. Ask before touching files outside it, and before deleting records someone else wrote. Fix facts in human-facing docs; leave their voice and structure to `ghostwriter`.

### Step 4: Hold the budget

Instruction files load into every session, so growth costs every future task. `agents-md` owns the size budget and its numbers. After your edits, measure the root `AGENTS.md` and any nested file you touched (`wc -l`, `wc -c`). If this change pushes a file over budget, make room in the same edit by cutting a line that no longer earns its place or moving directory-specific detail into a nested file. When the needed trim is larger than this change, finish the close-out and recommend an `agents-md` Refactor rather than restructuring the file here.

### Step 5: Verify, commit with the change, report

- Every path, command, and name in an edited passage exists: check with `rg`, or run the command or find it in the manifest.
- Searching the docs for the old names and approach returns nothing stale.
- The edited text contains no dating words from the list above.

Commit the doc edits with the change, in the same branch or PR, so code and docs merge together. The close-out is done when the edited docs match the code at HEAD and the budget holds. Report in a few lines: each file rewritten and what it now says, decisions deliberately left unwritten and why, contradicting records you did not touch, and line counts before and after for any instruction file.

## Gotchas

- An "Update:" paragraph under an old explanation leaves both versions in the file, and agents act on whichever they read first. Replace the old text.
- The same fact in `AGENTS.md` and a module doc drifts in one of them on the next change. Keep one home and point to it.
- A decisions section in a git-excluded plan file (`.captain/plan.md`, scratch plans) is a source for Step 1, never a home: it is gone when the worktree is removed.
- Writing every decision down is as harmful as writing none. A file full of reasons the code already shows buries the one constraint that matters and pushes instruction files over budget.

## Related Skills

- `agents-md`: owns the instruction-file size budget and full audits; run its Refactor when a file needs more than this change's trim.
- `pr-creator`: carries the story of the change in the PR body, which is where history goes.
- `chat-history`: recovers why something was decided when the reasoning was never written down.
- `ghostwriter`: human-facing docs that need more than a fact fixed.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a close-out.
