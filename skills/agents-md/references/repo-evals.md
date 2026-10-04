# Repo Evals

Use when the user wants evidence that instruction files, skills, or repo structure make agents faster or more correct here, or before and after a large AGENTS.md refactor. Audit scores judge the file; a repo eval measures what an agent does with it.

## Tasks

- Take each task from real work: a past bug, a feature the team shipped, a refactor someone did by hand. Write it as the request a user would send, ending with the acceptance contract in repo terms ("Leave the repo passing `<check>` and `<test>`. Do not commit.").
- Keep a handful (five is enough to start) that span the repo's risky paths: a security fix, a vertical slice through every layer, a rename across packages, a schema change.
- A bug task may ship a setup patch that plants the bug. Gate it in the drift check: a patch that no longer applies to HEAD crashes the next run instead of failing one task.

## Grading

- The grader is a test file the agent never sees. Read the task and grader before the agent starts (it may edit or delete files under `evals/`), and copy the grader in only after the agent's own check has run, so the agent cannot fit its work to it.
- A pass needs the repo's full check, the hidden grader, and a session that did not error. If the grader holds type-level assertions, run the type-checker over it too; a test runner does not fail on types.

## Budget header

Open each task with a budget block, so a pass that took twice the effort is visible:

```markdown
---
turns: 22
usd: 1
lines: 193
---
```

`lines` caps what the agent adds, counted from a diff that excludes generated files (lockfiles, migration snapshots). A pass over any budget reports as `slow`, not `pass`. Apply budgets when the report is built, not when the run records, so tightening one needs no rerun.

## Isolation

- Each task runs in its own worktree outside the repo, reset to one resolved commit (resolve the ref once, so a push mid-run cannot mix commits). Outside the repo, lint and the drift check never scan it. Keep the dependency folder between runs and reset everything else.
- Stage the setup before the agent starts, so the diff afterwards counts only the agent's work.
- Load only the repo's own settings, never the operator's user-level files, or the eval measures one person's machine. In Claude Code: `claude -p "<task>" --output-format json --setting-sources project --no-session-persistence --max-budget-usd <cap>`.
- Before the first task, prove the model answers (a one-turn ping with a tiny budget) and that the untouched checkout passes check and test. Either failure would blame every task on the model.

## Results

- Record a run the model never answered, or one an API error cut short (zero spend, a crashed CLI, an API error result), as `status: "error"`. Keep it in the log and off the scoreboard: it says nothing about the repo.
- Append each run to a committed JSONL log so the trend survives, and generate the scoreboard from it (latest result, turns, cost, lines, budget, medians over the last few runs). Mark the scoreboard as generated.
- An experiment on another branch or model writes to its own output file, never the scoreboard, and takes its task prompts and graders from the commit it evaluates.
- Repeat a task before trusting a change in turns or cost; one run is noise.
- Evals spend model credit, so run them on manual dispatch, not on every pull request.

## Reading the result

An instruction change earns its place when pass rate rises or median turns and cost fall across repeats. A change that moves nothing is a candidate for deletion, which is the same test the audit applies line by line.
