---
name: tidy
description: Applies diff-scoped simplifications using reuse, ownership, efficiency, and test-value checks, including actionable review findings. Use when asked to "tidy this", "simplify my diff", or "apply the review findings". For a read-only report use pr-reviewer; for repository architecture use codebase-architecture.
---

# Tidy

Apply simplifications inside the current diff and incorporate actionable review findings. A clean diff may need no edits. For a read-only report use `pr-reviewer`; wider architectural changes belong to `codebase-architecture`.

## Workflow

1. Record the staged and unstaged scope, or the requested branch range, plus existing edits. Use applicable project instructions and check results already available at this revision.
2. Inspect the relevant angles below. Reuse prior findings; do not repeat a full review simply because a different command produced it. Work locally by default. Delegation is useful only for substantial independent scopes supported by the host.
3. Merge findings by root cause, discard false positives, and apply the smallest complete fixes. Correctness fixes precede simplification; ownership fixes precede polishing code they remove.
4. Run checks affected by the changes, plus repository-required gates. Preserve exit codes and distinguish baseline failures. Report applied changes, material deferred decisions, and check results.

## Review angles

| Angle | Distinctive question | Evidence for a change |
|---|---|---|
| Reuse | Does this code need to exist, or does a live repository helper, stdlib, platform feature, or installed dependency cover it? | Existing contract and call site, including the boundary cases it handles |
| Quality | Does this introduce a second owner of state, an unused extension point, or unnecessary compatibility? | Actual consumers and state ownership, not line count alone |
| Efficiency | Does this add repeated work on a real hot path? | Call frequency, duplicate reads, unbounded retention, or a defeated no-change signal |
| Ownership | Is a caller patch compensating for a shared mechanism, or placed outside the subsystem that owns this behavior? | Writers, callers, and adjacent implementations; the deeper fix must be smaller than the special case |
| Test value | Can the test fail for a reason someone would act on? | A named regression, reachable branch, or public contract; literal diff mirrors and mock echoes add no assurance |

## Constraints that earn their place

- **Guard deletion requires system evidence.** Before removing a fallback, retry, lock, or validation, identify the writers, reachable states, staleness tolerance, and recovery owner. A guard that looks redundant locally can protect another caller. If its state cannot be ruled out, retain it and report the uncertainty.
- **Prior reviews are input, not authority.** Apply supported findings. If current evidence refutes a prior finding, explain why it was not applied; do not blindly implement it because the report called it confirmed.
- **No whole-file rollback of unrelated edits.** Scope formatters. If a formatter causes churn, remove only changes introduced by this run; `git restore <path>` can discard the user's earlier edits in the same file.
- **No abstraction quota.** Fewer lines is not a win if it hides different lifecycles or drops behavior. An existing owning subsystem is stronger evidence than a preferred generic pattern.
- **Tests follow risk.** Add or update a regression check when the edit changes behavior that can independently regress. Do not require tests for copy, a literal config change, or framework behavior already covered elsewhere.
- **Stop on evidence, not ceremony.** Once affected checks pass, repeat only for new changes, failures, or unresolved concerns. A second pass that keeps adding guards to the same spot calls for revisiting the mechanism.

## Output

Summarize what changed and why, checks and their results, and any substantial fix requiring a broader scope. Omit empty sections and "no findings" entries for every angle. Leave commits and PR creation to the user's request or `pr-creator`.

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
