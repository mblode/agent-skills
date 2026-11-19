# Audit checklist

## Contents

- How to run it
- Verdicts and score
- 1. Codebase shape
- 2. Enforcement ladder
- 3. Laws and repo promises
- 4. Verification
- 5. Agent instructions
- 6. Skills
- 7. Parallel agents and review
- 8. Stack
- 9. Tools and CLIs
- 10. Sites and docs
- Report

## How to run it

Run each row against the repo's default branch in a clean worktree. Evidence is a command and its output, or a file and line, from this repo at this SHA. Rows are read-only. Mark a row `n/a` only when the repo has no such surface (no web UI, no public site, no database, no concurrency), and say why. `P<n>` names the step in `build-playbook.md` that installs the row.

## Verdicts and score

- Row: `pass`, `fail`, or `n/a`.
- Section: `pass` when every applicable row passes, `partial` when at least half do, `fail` otherwise.
- Score: passed rows over applicable rows, per section and overall. Weight nothing; the list of fails is the output.

## 1. Codebase shape

| # | Rule | Check | Owner |
|---|---|---|---|
| 1.1 | One place per noun | AGENTS.md or a generator names where each kind of thing lives | `codebase-architecture` `wayfinding.md` |
| 1.2 | One name everywhere | Folder, package and deploy target share a name; the generator rejects a bad one with the fix (P9) | `build-playbook.md` |
| 1.3 | Registries match folders | A check fails when a registry and the folders disagree (P6) | `build-playbook.md` |
| 1.4 | Boundaries on the import graph | Lint bans cross-layer imports (web to database, router to ORM, service to framework) (P3) | `codebase-architecture` `guardrail-tooling.md` |
| 1.5 | One paved path | AGENTS.md names one reference module or a generator walks it | `codebase-architecture` `wayfinding.md` |
| 1.6 | No history comments | `rg -n -i -e "per review" -e workaround -e "as discussed" -g "*.ts" -g "*.tsx"` returns nothing, or each hit states a current constraint | `codebase-architecture` |
| 1.7 | Legacy is fenced | Legacy or imported code carries a marker or per-rule ceilings, never a folder-wide exception (P5) | `codebase-architecture` `contagion-markers.md` |

## 2. Enforcement ladder

| # | Rule | Check | Owner |
|---|---|---|---|
| 2.1 | One command runs every static gate | `check` exits 0 on main and reports every failure in one run (P1) | `codebase-architecture` `verification-tiers.md` |
| 2.2 | Gates fire at edit, push and CI | Post-edit hook, pre-push hook and a blocking CI check all present (P7, P11) | `codebase-architecture` `agent-runtime.md` |
| 2.3 | Diagnostics name the fix | Every custom lint and guard message says what to use instead | `references/diagnostics.md` |
| 2.4 | Rules bite | A planted violation fails with its message; revert passes | `codebase-architecture` `enforcement-ladder.md` |
| 2.5 | No prose duplicates a check | No AGENTS.md line restates a lint rule, type or test | `agents-md` |
| 2.6 | Exception lists only shrink | Adding an entry to any exception list fails; a stale entry fails (P5) | `build-playbook.md` |
| 2.7 | Exceptions carry reasons | Every entry or override has a reason, and a date or PR when temporary | `build-playbook.md` |
| 2.8 | Dead code gated | knip or equivalent clean; ignores are a shrink-only list (P2) | `codebase-architecture` `guardrail-tooling.md` |
| 2.9 | Size capped | A file over the cap fails; existing ones are listed per file (P4) | `codebase-architecture` `guardrail-tooling.md` |

## 3. Laws and repo promises

| # | Rule | Check | Owner |
|---|---|---|---|
| 3.1 | Laws written | `LAWS.md` exists; each law links a check | `references/laws.md` |
| 3.2 | Laws run | Property tests in the unit suite; TLC and Lean steps in CI where specs exist | `references/laws.md` |
| 3.3 | Tenancy and idempotency covered | A property for tenant isolation and one per idempotent operation, where the repo has them | `references/laws.md` |
| 3.4 | Repo promises have mutants | Each census or model has a planted mutant that fails it (P10) | `references/laws.md` |
| 3.5 | Law changes reviewed | Law, spec and census paths require a person's review (CODEOWNERS or a ruleset) | `references/laws.md` |

## 4. Verification

| # | Rule | Check | Owner |
|---|---|---|---|
| 4.1 | Doctor | `doctor` exists, changes nothing, names a fix per failure | `app-verification` |
| 4.2 | Verify fails empty | `verify` writes a proof and fails when no checks ran or HEAD moved (P10) | `app-verification` |
| 4.3 | Feature map | A feature map from the user's point of view; no changed file uncovered | `app-verification` `feature-map-format.md` |
| 4.4 | Every app tested | Each app has a test or a reasoned entry in a shrink-only list (P10) | `build-playbook.md` |
| 4.5 | Verify says its limits | Each app's AGENTS.md `Verify` section names what it proves and what it does not (P8) | `build-playbook.md` |
| 4.6 | Seed and accounts | Seed is deterministic and idempotent; test accounts per role | `app-verification` |
| 4.7 | Worktree isolation | Two worktrees verify at once; a worktree with no slot is refused | `app-verification` `worktree-isolation.md` |
| 4.8 | Repro before fix | Bug PRs carry a repro and a failing test | `app-verification` `bug-handoff.md` |

## 5. Agent instructions

| # | Rule | Check | Owner |
|---|---|---|---|
| 5.1 | Single source | AGENTS.md at root; nested files hold only what differs | `agents-md` |
| 5.2 | Commands run | Every command in AGENTS.md runs | `agents-md` |
| 5.3 | Shared headings | Nested AGENTS.md files use one heading set including `Verify` (P8) | `build-playbook.md` |
| 5.4 | Rules name checks | Each rule names its enforcing check, or is marked as prose to promote | `build-playbook.md` |
| 5.5 | Review aims at over-production | `REVIEW.md` blocks one-caller abstractions, duplicates, mock-asserting tests and widened exceptions (P12) | `tidy` |
| 5.6 | Docs index | Trust labels and consult-when lines; every path resolves | `codebase-architecture` `wayfinding.md` |
| 5.7 | Lessons written back | A dated lessons log exists and has entries in the last month | `build-playbook.md` |
| 5.8 | Setup is one script | `setup.sh` is idempotent and every agent's session start calls it (P7) | `codebase-architecture` `agent-runtime.md` |

## 6. Skills

| # | Rule | Check | Owner |
|---|---|---|---|
| 6.1 | One folder, linked | `skills/` is the only skills folder; agent paths are symlinks to it | `build-playbook.md` |
| 6.2 | Descriptions route | Short, verb-led, quoted triggers, validator clean | `agent-skills-creator` |
| 6.3 | Skills stay true | A check fails a skill that names a missing path or a retired command | `agent-skills-creator` |
| 6.4 | Evals exist | Scenarios per skill with neutral workspace names | `agent-skills-creator` |

## 7. Parallel agents and review

| # | Rule | Check | Owner |
|---|---|---|---|
| 7.1 | One required check | The ruleset requires one CI check; drafts skip CI (P11) | `ci-speedup` |
| 7.2 | PRs name their request | CI fails a PR body with no request line (P11) | `build-playbook.md` |
| 7.3 | CI helpers tested | Each CI gate script has a test that makes it fail (P11) | `build-playbook.md` |
| 7.4 | Nightly covers shortcuts | An uncached full run is scheduled and alerts (P11) | `ci-speedup` |
| 7.5 | Small units | Merged PRs are mostly 400 lines or fewer outside lockfiles | `ci-speedup` |
| 7.6 | Advisory budgets | Test-line and CI-time budgets warn, with a reasoned override (P12) | `test-audit` |

## 8. Stack

| # | Rule | Check | Owner |
|---|---|---|---|
| 8.1 | Strict compiler | The base tsconfig has the flags in P2 | `build-playbook.md` |
| 8.2 | One package manager | A guard names the replacement for any other manager or runner (P6) | `build-playbook.md` |
| 8.3 | Env in one place | Runtime code reads env only through `env.ts`; `.env.example` lists every key | `codebase-architecture` `guardrail-tooling.md` |
| 8.4 | Pins have reasons | Every override, pin and patch has a written reason (P6) | `build-playbook.md` |
| 8.5 | Migrations immutable | CI fails an edit to a shipped migration (P6) | `build-playbook.md` |

## 9. Tools and CLIs

| # | Rule | Check | Owner |
|---|---|---|---|
| 9.1 | Machine-readable | Repo CLIs (doctor, verify, seed, scripts) offer `--json` and stable exit codes | `dx-audit` |
| 9.2 | Safe to retry | Mutating commands are idempotent or offer `--dry-run` | `dx-audit`; `ax-audit` |

## 10. Sites and docs

| # | Rule | Check | Owner |
|---|---|---|---|
| 10.1 | Agent-readable | `llms.txt` and Markdown routes where the product has public docs | `agent-ready`; `seo` |

## Report

```markdown
Agent-friendly audit: <repo> @ <sha>   <passed>/<applicable> rows

| Section | Verdict | Passed | Gaps filed |
|---|---|---|---|
| 1. Codebase shape | partial | 5/7 | #<n>, #<n> |
| 4. Verification | fail | 2/8 | #<n> |

Gaps (highest leverage first):
- 4.2 No verify command; every change needs a person to check it. #<n>
- 2.3 Router boundary message says "not allowed" with no fix. #<n>
```

File each gap in the repo's tracker titled `<row id>: <rule>`, with the row's check as the done condition and the playbook step or owner in the body.
