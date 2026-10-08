# Agent Runtime

What the harness runs around an agent: the edit hook, and jobs where an agent changes code with no person watching. Load when configuring session hooks, the permission allowlist, an unattended fix job, or a job that triages alerts. Worktree bootstrap (ports, databases, env files per checkout) belongs to `app-verification` (`references/worktree-isolation.md`); review gating is rung 4 of `enforcement-ladder.md`.

## The post-edit hook

Run the formatter and the autofixing linter on the file just written, after every edit. The tree stays clean by construction, and a formatting gate never fails on agent-authored code. Keep pre-commit for what a per-file hook cannot see: whole-repo checks, cross-file rules, and the staged set.

Two details decide whether the hook teaches or just tidies:

- **Exit blocking when lint errors survive the autofix.** Formatting is silent and always exits 0, but the linter's leftover output goes to stderr with the harness's blocking exit code (2 in Claude Code), so the agent reads the violation on the turn it caused it. A hook that swallows the output fixes what it can and hides the rest until CI.
- **Skip what the tool cannot read.** Exit 0 when the edited path no longer exists or its extension is not one the linter handles; a hook that errors on a Markdown edit trains everyone to disable it.

A session-start hook that installs dependencies when they are missing keeps a fresh worktree from spending its first turn diagnosing a missing module as a code error.

Allowlist the read-only commands an agent runs constantly (status, log, diff, typecheck, lint, test, search). Each approval prompt is a stall, and a session spent approving `git status` twenty times trains everyone toward blanket approval, the outcome the prompts exist to prevent. Allowlist by command shape, not prefix breadth: `git diff` is read-only; `git` is not.

Where the repo has commands that should never run unattended (a production migration, a force push, a data wipe), add a pre-command hook that blocks them. The harness owns the settings file's schema and matcher syntax; do not restate it here.

## Unattended fix jobs

A scheduled or event-driven job where an agent reproduces a failure and drafts a fix, with no person in the loop until review. The agent's own report is not the gate; the workflow around it is. Each rule below is a check the workflow runs, not an instruction in the prompt.

- **Reproduce before fixing.** The job's first verdict is reproduced, already fixed on the default branch, or could not reproduce. Only "reproduced" continues to a fix; "already fixed" closes the issue with no fix run, and both other verdicts post the report as a comment. Parse the verdict from a fixed first line, and treat anything else (including a run that returned nothing) as could not reproduce.
- **The diff must add a test.** Refuse a change with no test file in it. This only proves a test exists, so the reviewer confirms it fails without the fix, and the job's PR says so.
- **Protected paths.** Refuse a diff that touches CI workflows, agent settings, infrastructure, scripts, the eval harness, the instruction files, or the review rubric. An agent that can edit its own gate has no gate. Check the patch again in the job that applies it, because the job that ran the agent is not trusted.
- **Re-run check and test outside the model.** The workflow runs the repo's check and test commands itself on the agent's change; "the agent said they pass" is not evidence. Add the browser suite when the change touches the web app, and attach its recording.
- **Split read-only from write.** The job that runs the agent runs code the agent wrote, so it holds nothing worth stealing: no cloud login, no OIDC token, a read-only repository token, and only the model key. It hands a patch to a separate job that runs no repository code and is the only one allowed to push and open the draft PR. Nothing in the loop merges or deploys.
- **Caps and dedupe.** Limit fix attempts per run and per day, and give each failure a fingerprint; an open issue, or one closed recently, mutes its fingerprint so the same error does not open a second issue or a second fix. Run the watcher that opens issues in a single concurrency group so two runs cannot race.
- **Isolated settings and a budget.** Start the agent with project settings only (no user settings), no MCP servers unless the task needs one, an explicit tool allowlist with shell restricted to the repo's own scripts and read-only git, a non-interactive permission mode, a per-run spend cap, and no session persistence. Pin the CLI version. Record the run's cost in the PR or comment.
- **Untrusted evidence.** Error text and issue bodies go into the prompt inside a delimited data block with any closing delimiter stripped from the content, so a log line cannot end the block and issue instructions.
- **A person merges.** The job opens a draft. A PR opened with the default workflow token may start no CI or review bots; use a narrowly scoped token for that step if they must run.

Prove the gates the same way as any other check: feed the job an issue that is already fixed (closes, no PR), and a fix with no test (comment, no PR).

## Alert triage

A job where an agent reads a fired monitoring alert, with no person watching, and decides what it is before anything is fixed. An alert is not yet a failure, so triage has its own verdicts, parsed from a fixed first line like the fix job's; anything else counts as a real failure, so a bad parse can never silence an alert. The job runs under the fix job's other rules (read-only split from write, isolated settings, untrusted evidence, caps and dedupe in a single concurrency group), and every issue or draft it opens carries the alert's fingerprint, so an open or recently closed one mutes the next.

- **Real failure.** The alert caught a real defect. Open an issue for the fix job above, which runs it under every rule there, starting with its own reproduce step.
- **Alert is wrong.** The system is healthy and the alert's definition (its threshold, window, or query) is wrong. Open a draft PR that changes only that one alert's definition. Its body shows the recent datapoints, and that the new definition still fires on the last real failure (or on a replayed known-bad sample if the alert has never caught one), so deleting, disabling, or muting the alert never qualifies. This draft is the one exception to the fix job's test rule and to infrastructure being a protected path; the workflow refuses it if it touches anything besides that definition, and a person still merges it.
- **Noise.** A one-off blip that needs no change. Resolve the alert with the report attached. A second Noise on the same fingerprint within the dedupe window is Alert is wrong.

Route every alert to one quiet channel, where every alert is worth a look. An alert that keeps firing with nothing to do trains people to skim the channel, and the next real failure lands in the noise; Alert is wrong is how the channel stays quiet.

Prove it with a flapping alert (a draft touching only its definition), an Alert is wrong diff that also edits a workflow (refused, no PR), and a run that returns nothing (an issue opens).
