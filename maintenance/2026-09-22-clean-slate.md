# Two thin skills for agent-scale work, 22 September 2026

Baseline: `c263f55` on main, 26 skills. Result: 27 skills. This is a static retention decision; the new scenarios are specifications and no behavioural run is claimed.

## What changed

- Added `backlog`: runs a backlog that `planning` has already split, using a parallel-agent ledger, WIP capped at review capacity, stall and budget rules, and a weekly retro. `references/routing.md` is the one dated file in the collection that names models.
- Added `gates`: installs hooks, required checks, a PR size limit and stop-on-red-main, and proves that tests, evals and scorers can fail.
- Added `codebase-architecture/references/greenfield.md`, covering a walking skeleton, the first full vertical slice, a pass/fail/unknown production-eligibility gate, and decision records with flip conditions. The checks come from the 22 September architecture audit of the Series A rebuild.
- Fixed `scaffold-cli`'s tsdown config. The node-platform default emits `.mjs` and `.d.mts`, so `bin` and `exports` pointed at files that did not exist. `fixedExtension: false` fixes that.
- Fixed `multi-tenant-architecture`'s Vercel proxy key. Replacing dots with underscores maps different hostnames to the same key. It now hashes the hostname and compares the stored hostname on lookup.
- Retired `save-md`; the host covers it.
- Added "Compile to a gate" and a no-model-names rule to `capability-delta.md` and AGENTS.md.

## What was tried and reverted

An earlier pass on this branch merged the collection into 15 skills: architecture, scaffold, ship, design (five skills), gates with ci-speedup and agents-md, and backlog with planning. The merges moved words rather than cutting them: references went from 273k to 242k words, and `design` alone reached 108k. Each merged skill also served several unrelated jobs behind one trigger.

That pass was reverted in favour of small single-purpose skills. Every original skill is restored from `c263f55`, with its rule sets intact, and each new skill does one thing:

- `backlog` dispatches; `planning` still splits.
- `gates` installs brakes; `ci-speedup` and `agents-md` keep their own jobs.

The merged versions remain in this branch's history (`440a7c0`, `5aee3f6`, `4e74100`). They include an executable `probe.mjs` for UI verification, a `merge-ready.sh` for PRs, and an npm trusted-publishing setup reference, if any of those are wanted later as additions to the original skills.

## Evidence still owed

- Run routing with `claude -p` and `codex exec` on the 27 descriptions, and compare against the `c263f55` baseline.
- Run a none-versus-skill behavioural comparison for `backlog` and `gates` on their five scenarios each.
