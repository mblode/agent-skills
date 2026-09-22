---
name: gates
description: Installs and verifies the brakes that make agent output safe to merge. Covers pre-commit and pre-push hooks, required CI checks including the container build, PR size and review-capacity limits, audits proving tests, evals, scorers, and dashboards can actually fail, measured CI critical-path speedups, and AGENTS.md as the one cross-agent instruction file with verified commands. Use when asked to "add pre-commit hooks", "agents open PRs without running tests", "check the check", "can this test fail", "our evals are green but", "is this dashboard right", "speed up CI", "CI is slow", "improve my AGENTS.md", "audit our agent instructions", or when main keeps breaking under agent PRs. For the PR itself use ship; for code findings use tidy; for dispatching agents use backlog; for SKILL.md files use agent-skills-creator.
compatibility: CI speed reads run and job timings through the GitHub CLI or a GitHub MCP server; other CI hosts need their equivalent API. Hooks assume git and the repository's toolchain.
---

# Gates

Every harness worth keeping was kept for its brakes. The failures that cost most were the ones where nothing fired: main went red and dispatch carried on, a container never built on the PR, a suite was green only because it was cached. This skill puts an exit code where there was prose, then proves each exit code can go red.

- **IS:** installing hooks and required CI checks, PR size and review-capacity rules, auditing whether a test, eval, scorer, boundary script, or dashboard can fail, shortening CI's critical path with a measured ledger, and keeping AGENTS.md the single, verified instruction source for every agent.
- **IS NOT:** getting a red build green or opening and watching the PR (`ship`), reviewing a diff for bugs (`tidy`), splitting and dispatching work to agents (`backlog`), writing a pipeline for a repo that has none (`scaffold`), architecture boundaries and decision records (`architecture`), SKILL.md files (`agent-skills-creator`).

## Shared contract

- **Brakes over prose.** A rule that a script can check becomes a hook, a lint rule, or a required check, and the prose is deleted once the gate exists. Prefer, in order: linter or formatter rule, git hook (fires whichever agent committed), required CI check, tool-native hook (one tool only).
- **Watch it fail.** A gate is installed only after a deliberate violation turns it red and the fix turns it green. A gate nobody has seen fail is a claim.
- **Gates live in the repo.** Hooks in `lefthook.yml`, checks in the workflow, rules in AGENTS.md: portable across Claude Code, Codex, and Cursor because none of them depends on the agent.
- **Name the evidence level.** Every verification claim says which it rests on: cached check, fresh tests, build (including the container), or runtime startup. Each has been green while the next was red.

## Modes

| Mode | Triggers | Done when | Read |
|------|----------|-----------|------|
| **Install** | "add hooks", "agents skip typecheck", "main keeps breaking", "required checks", "PR size limit", "auto-approve dependency bumps" | Hooks and CI jobs committed on the working branch, each shown failing on a violation then passing; the pre-PR command named in AGENTS.md; settings changes (required checks, rulesets) written up for the user to apply | `references/hooks.md`, `references/review-capacity.md` |
| **Check-the-check** | "check the check", "can this test fail", "evals are green but", "is this dashboard right", after a gamed test | A findings table: each suspect check, the detection recipe run, the result, and the fix or gate; fixes landed where the check is in the diff's scope | `references/check-the-check.md` |
| **CI speed** | "speed up CI", "CI is slow", "why does a PR take 15 minutes", agents merging faster than checks finish | A mergeable pipeline change and a ledger whose after column comes from the branch's own runs | `references/ci-speed.md` and the CI files below |
| **Instructions** | "improve my AGENTS.md", "audit our agent instructions", "make instructions work across agents", a stale command | AGENTS.md scored, commands run, diffs applied (or proposed, for an audit-only request), and each tool shown to load it | `references/instructions.md`, `references/quick-checklist.md` |

A request spanning modes runs them in the order Check-the-check, Install, Instructions: a gate built on a check that cannot fail is still a claim, and AGENTS.md then names the gates rather than restating them.

## References

| File | Read when |
|------|-----------|
| `references/hooks.md` | Install: the check, verify, and verify:full tiers, the boot check, lefthook pre-commit and pre-push, the CI job that repeats the hooks, the container build on the PR, session-start, post-edit, and worktree hooks |
| `references/review-capacity.md` | Install: PR size gate, WIP, stop merging when main is red, required checks, auto-approval rules, the Risk and Proof PR section, the blast-radius rubric for auto-approval, the queueing knee |
| `references/check-the-check.md` | Check-the-check, and before trusting any green check a gate or claim rests on |
| `references/ci-speed.md` | CI speed: what changes the number, the five-step measured workflow, and its gotchas |
| `references/ci-measuring.md` | CI speed Step 1 (timings, percentiles, critical path, test-runner duration lines, baseline table) and Step 4 (verifying the after-measurement) |
| `references/ci-levers.md` | CI speed Step 2: the lever catalogue by class, preconditions, expected gain, known failures |
| `references/ci-ledger.md` | CI speed Step 5: the ledger, trend table, and the instruction-file lines that stop the layout regressing |
| `scripts/ci-timings.sh` | CI speed Step 1 and Step 4: one run's jobs, steps, and critical path, or `--runs N` for median and p90; `--help` gives the forms |
| `references/instructions.md` | Instructions: the two line tests, audit workflow, command verification, what each tool loads, where moved content goes |
| `references/quick-checklist.md` | Instructions: every audit, the 12-check triage |
| `references/quality-criteria.md` | Instructions: quick audit fails, the repo is high-risk, or full scoring is requested |

## Pre-approved loops

These run without asking because they touch only the working tree, a scratch clone, or read-only APIs:

- Installing lefthook locally, adding or editing hook and workflow files on the working branch, and committing a deliberate violation in a scratch branch or clone to watch a gate fail (then discarding it).
- Running the suite cold: a fresh clone in a temporary directory, `--force` past the task-runner cache, a clean install.
- Reading CI runs, branch protection, and rulesets through the API; pushing the working branch to measure CI.
- Editing AGENTS.md when the request is to improve, fix, or write it, and running every command it names.

Ask first: changing branch protection, rulesets, or required checks (they bind everyone), enabling auto-approval or auto-merge, paid runners or more parallel jobs on a metered plan, merging, and deleting a test rather than fixing it.

## Gotchas

- Agents open PRs without running tests, lint, or typecheck even when prompted to. A hook or required check fires; a sentence in AGENTS.md does not.
- Hooks are bypassable (`--no-verify`) and absent from a fresh sandbox that never ran `lefthook install`. CI repeats every hook as a required check, and `prepare` installs the hooks on every clone.
- A cached `turbo run test` was green while a fresh `turbo run test --force` failed on an env singleton evaluated at import. Gate main on an uncached run at least nightly.
- A container that never built on the PR broke the deploy after merge. Build the image on the PR as a required check, even without pushing it.
- Nothing fired when main went red, so agents kept merging onto it. A required check that fails while main is red, with a label for the fix PR, is the brake.
- An e2e suite was forced green with a test-only HTTP header, and agents have added conditionals inside tests so assertions only run on one branch. Both are detectable with a grep and a lint rule.
- A quality scorer checked only for at least 20 characters; an eval with `failureMode: 'skip'` had 100% of runs fail silently. A green number with no must-fail fixture proves nothing.
- A boundary script claimed more enforcement than it had. Commit a violation of each claimed boundary and watch the script go red before AGENTS.md cites it.
- `turbo run typecheck`, `lerna run`, and `npm run -ws --if-present` skip workspaces that lack the script, silently. A green root command proves nothing about a workspace that never ran.

## Related skills

- `ship`: opens the PR with the Risk and Proof section and gets a red build green.
- `backlog`: sets WIP from the review capacity this skill encodes, and routes retro findings here as gates.
- `tidy`: reviews the gate changes like any other diff.
- `scaffold`: a new repository's first pipeline; this skill's CI speed starts from timestamps a new repository lacks.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a user task.
