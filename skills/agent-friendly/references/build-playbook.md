# Build playbook

The order to install agent guardrails in a repo, new or existing. Every step comes from a production monorepo of dozens of apps written mostly by agents, and the "Because" line is the failure that made the step necessary there. Where an owner skill already holds the mechanism, the step names it and adds only what it lacks.

## Contents

- How to run it
- 1. One check command
- 2. Strict compiler and dead-code settings
- 3. Boundary lint that names the fix
- 4. File size cap
- 5. Exception lists only shrink
- 6. Registries and generated files match their source
- 7. Hooks instead of prose
- 8. Instructions
- 9. Scaffold and generator
- 10. Verification
- 11. CI
- 12. Review for over-production
- Done

## How to run it

Check each step's audit row first and skip it if it passes. For each step you install: land the guard and the fix (or a per-file list) for its existing violations in one change, plant a violation and watch it fail with its fix message, revert, and move on. Steps 1 to 7 make the repo safe to edit; 8 to 10 make agent work verifiable; 11 and 12 make it mergeable. On a repo with no web UI, database or deploys, mark the steps that need one `n/a`. The steps name TypeScript tools (tsconfig, knip, oxlint) because that is where they were proven; in another stack keep the guard and swap the tool.

## 1. One check command

- **Rule:** one command (`check`) runs lint, format, every guard script and types, in parallel, and keeps going past a failure so one run reports everything. A `check:changed` variant lints only changed files and falls back to the whole repo when lint config, dependencies or a tsconfig changed, printing which it chose and why.
- **Because:** agents run what AGENTS.md names. Four commands means one gets skipped; a check that stops at the first failure costs a round trip per error.
- **Check:** `check` exits 0 on main; break two unrelated things and both are reported in one run.
- **Owner:** `codebase-architecture` `verification-tiers.md`.

## 2. Strict compiler and dead-code settings

- **Rule:** the strictest TypeScript base (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules`, `noImplicitOverride`), listed as a global input to the task runner so changing it re-checks everything. Dead-code detection (knip) with `includeEntryExports: true` when packages export `"./*"`; without it every file is an entry and no unused export is ever reported.
- **Because:** an agent fills an unchecked index or an optional field with a confident guess; the compiler is the cheapest reviewer.
- **Check:** knip clean; its ignore list is a shrink-only list (step 5).
- **Owner:** `codebase-architecture` `guardrail-tooling.md`.

## 3. Boundary lint that names the fix

- **Rule:** restricted imports and properties whose message says what to use instead. The set that held:
  - only the API and its database package import the database; everything else calls the API through its contract package;
  - routers parse and delegate, so the ORM is banned in router files;
  - services import no web framework;
  - runtime code reads environment variables only through one `env.ts` (`no-process-env` outside entry points);
  - a property that bypasses row-level security is banned outside an explicit allowlist, and the message names the tenant-scoped call;
  - one UI kit and one icon set, with the banned alternatives named;
  - anti-slop rules: no object-literal parameters that hide arity, no `unknown` returned to callers, no widen-then-assert casts, no module mocking.
- **Because:** an agent copies the nearest example. One router that queried the database directly became the pattern in the next three PRs.
- **Check:** plant each banned import; each fails with its message.
- **Owner:** `codebase-architecture` `guardrail-tooling.md`; messages in `diagnostics.md`.

## 4. File size cap

- **Rule:** a hard cap of about 250 lines, blank lines and comments excluded, on code people write; generated files and migrations exempt. Files already over it go in a per-file list (step 5) that leaves when each is split.
- **Because:** agents append. A file nobody splits grows until no agent can read it in one pass, then gets edited blind.
- **Check:** a new 251-line file fails.

## 5. Exception lists only shrink

The growth guard is `codebase-architecture` `enforcement-ladder.md` rung 3 ("Close the growth gap"): one script fails an added entry and a stale entry in every exception list. Point it at all of them: lint ceilings, size exemptions, knip ignores, "apps without tests", package-manager exceptions, unregistered folders. What the owner does not say:

- **Rule:** every entry carries its reason, and a date or PR when it is temporary. "Not done yet" is not a reason. When the format cannot hold comments (JSON), keep the reasons in a sibling file the guard also reads.
- **Rule:** legacy or imported code gets per-rule, per-file ceilings, never a folder-wide exception. New files in that folder inherit every rule.
- **Because:** under deadline the cheapest green is appending your path, and folder-wide exceptions silently covered every new file written there.
- **Check:** add an entry, the guard fails; delete a file named in a list, the guard fails.

## 6. Registries and generated files match their source

- **Rule:** any registry (a projects file of apps, hosts and deploy settings) has a schema and a check that every folder has an entry, every entry has a folder, names follow the convention, and slugs, hosts and deploy targets are unique.
- **Rule:** generated docs and code get a `--check` mode or a regenerate-and-diff step; codegen (ORM migrations, clients) must leave `git diff --exit-code` clean.
- **Rule:** a shipped migration is immutable: CI fails on an edit, rename or delete of a migration already on main, with narrow allowances for the tool's own format bumps.
- **Rule:** one package manager, enforced by a script that scans scripts, workflows, Dockerfiles, shebangs and deploy config, naming the replacement for each finding.
- **Rule:** every dependency pin, override and patch has a written reason, in a file that allows comments; a patch for a security fix has a test proving it.
- **Because:** registries drift the moment a second agent adds an app; an agent "fixing" a failing migration by editing it corrupts every database that already ran it.
- **Owner:** `codebase-architecture` `guardrail-tooling.md` (regenerate-and-diff).

## 7. Hooks instead of prose

- **Rule:** a post-edit hook runs the formatter and the autofixing linter on the edited file, exiting with the harness's blocking code when findings remain (`codebase-architecture` `agent-runtime.md` has the detail).
- **Rule:** a pre-push hook runs `check:changed` (a few seconds). "A step an agent must remember is a step it skips."
- **Rule:** one idempotent `setup.sh` installs pinned, checksummed tools and sets the hooks path; every agent's session start calls it (Claude Code session-start hook, Codex profile, Cursor environment file), so cloud agents get the same tools as people.
- **Rule:** `skills/` is the one skills folder; `.claude/skills` and `.agents/skills` are symlinks to it, so a new skill is discovered with no extra step.
- **Rule:** install, check, test and build need no Docker, no macOS and no secret, so any agent can run them.
- **Check:** a fresh clone runs `setup.sh` twice with no change the second time; a lint error in an edit is reported on the same turn.

## 8. Instructions

- **Rule:** one root AGENTS.md holds the rules; each app or package AGENTS.md holds only what differs, under a shared heading set: `Commands`, `Verify`, `Layout`, `Decisions`, `Rules`, `Departures from the required stack`. A package file can be five lines.
- **Rule:** `## Verify` names the one command that proves the app, what it proves, and what it does not (real sign-in, live telemetry, provider delivery). A check fails an app without it.
- **Rule:** every rule in AGENTS.md names the check that enforces it, or is marked as prose to promote.
- **Rule:** a docs index with trust labels and consult-when lines (`codebase-architecture` `wayfinding.md`); current docs are edited in place and git keeps history, with no decision-record chains to reconcile.
- **Rule:** a dated, append-only lessons log. A person correcting the same thing twice, a wrong skill step, or a shipped job each add a line; a scheduled pass turns repeated lessons into rules or skill edits.
- **Owner:** `agents-md`.

## 9. Scaffold and generator

- **Rule:** new apps come from a template that already passes every guard and ships: AGENTS.md with Verify, a README, a health route and its test, a tenant-isolation test that runs on an in-process database with no keys, a fixture sign-in for local use, `env.ts`, observability wiring, and deploys off until a person turns them on.
- **Rule:** the generator validates the name and says the fix in its error (for example, a prefix pattern and a length limit so `<name>-staging` fits a DNS label), refuses a name already used anywhere in the registry, fails loudly when a rename anchor is missing ("update the generator to match it"), and registers the app atomically with a lock and backups.
- **Rule:** a one-command pre-push check for a single app runs everything that has failed a real PR: pinned runtime version, frozen lockfile, lint, types and build, tests.
- **Because:** the first build of an app happening in production, and lockfiles written by the wrong runtime version, both reached main before this existed.
- **Check:** a test runs the real generator into a temporary folder and runs `check` on the result.

## 10. Verification

- **Rule:** every app has a test, or an entry with a reason in a shrink-only list.
- **Rule:** per-worktree port and database slots; a linked worktree with no slot is refused rather than falling back to the main instance (`app-verification` `worktree-isolation.md`).
- **Rule:** a proof receipt fails if no checks ran, if HEAD or the source changed during the run, or if a browser run had skips or retries.
- **Rule:** intent trace: each request in an app's intent file maps to a requirement and a proof file, and an orphan either way fails. It proves a proof file exists, not that it proves the requirement; say so.
- **Rule:** every repo-level promise (CI blocks, deploys stay off, skills resolve) gets a census or model plus a planted mutant that must fail it (`laws.md`).
- **Rule:** a test pins each incident. A test helper that leaked `GIT_DIR` once pushed fixture commits to the real main branch; a preload that strips git environment variables and allows only the file protocol now runs before every test.
- **Owner:** `app-verification`.

## 11. CI

- **Rule:** one required check, run as one job that starts its parts in the background and waits on them, with merge-queue support. Drafts skip CI, which is safe because a draft cannot merge.
- **Rule:** the PR body must name the request it answers (`Request: <issue or person>`; "n/a" and "TBD" fail). A small workflow re-runs the check when only the description changed.
- **Rule:** inside it, besides `check` and tests: secret scanning on the new commits (failing, not passing, when git errors), new known vulnerabilities, new static-analysis findings against a shrink-only baseline, no client data files, migrations immutable, codegen clean, and "checks leave tracked source unchanged".
- **Rule:** CI helper scripts have their own tests against throwaway repos, so a broken gate cannot pass silently.
- **Rule:** test results are cached with OS, CPU and runtime versions in the hash ("a suite that passed on a Mac proves nothing for Linux CI"); an uncached nightly run covers clock and network tests and the whole-repo lint that PR shortcuts skip.
- **Rule:** while main is red, one issue stays open naming the merge that broke it.
- **Owner:** `ci-speedup`.

## 12. Review for over-production

- **Rule:** `REVIEW.md` targets what `check` cannot see: too much code. It blocks a one-caller abstraction, a duplicate of existing code, a new dependency without a reason, a test that asserts mocks or pins wording, a helper exported only for tests, a swallowed error, a widened exception list, and a PR with no user outcome or evidence. A finding needs a file and line or the thing to delete.
- **Rule:** budgets stay advisory where a hard cap would be gamed. A net-new test-line budget per PR warns and is silenced with a reason in the PR body; "a hard cap teaches agents to cram assertions into fewer lines". CI time budgets warn until a repository variable makes them blocking.
- **Because:** agents write a test per change, so the suite grows faster than the code; two pruning rounds removed thousands of tests in the same few shapes.
- **Owner:** `tidy`; `test-audit`.

## Done

`check` exits 0, CI's one required check is green, every guard added has been seen failing on a planted violation with its fix message, and AGENTS.md names each check rather than restating it.
