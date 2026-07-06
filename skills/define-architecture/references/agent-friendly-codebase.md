# Agent-friendly codebase

Make a codebase cheap and safe for coding agents to work in. Load when preparing a repo for agentic coding, wiring guardrail tooling, or marking legacy code.

## Why agents care

Code cleanliness does not change an agent's pass rate; it changes the cost of every task. On matched clean/messy repos, Claude Code used 7 to 8% fewer tokens and revisited files 34% less often when the code was clean (SonarSource, 2026). Two mechanisms drive this:

- **Traversal cost.** Agents rebuild context per task by grepping and reading. Predictable names and small files mean the first guess lands; bloated files mean chunked reads and repeated visits.
- **Convention contagion.** Agents mimic whatever code they read first. A legacy pattern sitting unmarked next to the current one gets copied, even when AGENTS.md says otherwise.

## Deterministic guardrails over prompt rules

A rule an agent must remember is a suggestion; an exit code is a contract. Anything a static tool can check moves out of AGENTS.md and into tooling, wired into both a pre-commit hook (lefthook or husky) and CI. Both, always: hooks are not guaranteed installed, and CI alone gives feedback too late for the agent's edit loop. When a hook fails the agent's commit, it self-corrects on the spot; that loop is the cheapest QA round available.

TypeScript-first tools per category (swap per ecosystem; the categories are language-agnostic):

| Category | Tool | Catches |
|---|---|---|
| Dead code, unused exports and deps | `knip` | Orphaned helpers agents leave behind |
| Copy-paste duplication | `jscpd` | Near-duplicate blocks that should share one implementation |
| Import boundaries and cycles | `dependency-cruiser` or eslint `boundaries` | Layer violations (enforce the handler/service/dao contract) |
| File size and complexity | eslint `max-lines` (~400), `complexity` | Files too big to read in one pass |

## Legacy quarantine

Mixed-quality code teaches agents the wrong conventions, and deleting legacy is not always an option. Quarantine what stays:

- Mark do-not-reference code with a greppable comment at the top of each file: `// LEGACY: do not use as a reference or extend. See docs/legacy.md`.
- Keep `docs/legacy.md` short: which areas are frozen, why, and what to use instead. Comments reference it instead of repeating it.
- State the marker convention once in AGENTS.md so agents know what the marker means before they hit one.
- Never leave an unmarked old/new dual path (deprecated endpoint next to its replacement, two ways to fetch the same data). Delete the old path or mark it; an unmarked pair reads as two valid conventions.

## Locality and naming for cheap traversal

- Name files for what an agent (or new teammate) would grep first: `invoice-refunds.ts`, not `utils2.ts` or `helpers.ts`.
- Keep files small enough to read in one pass; the ~400-line lint cap doubles as a traversal budget.
- Co-locate code that changes together; a feature spread across six directories is six reads before the first edit.
- One canonical name per concept. Naming divergence (one concept, three names) is the strongest confusion signal for agents and humans alike; see the domain-language mapping in [deepening-existing.md](deepening-existing.md).

## Scheduled refactor passes

Agent-written code accretes single-use helpers, stale dual paths, and bloated files even with guardrails. Schedule small cleanup passes instead of waiting for a rewrite:

1. Run the dead-code and duplication tools; delete what they flag.
2. Split any file over the size cap along its natural seams.
3. One slice at a time, verified by the existing test suite; never big-bang (the Adoption workflow's slice rule applies).

Refactor safety equals test coverage: a thin suite caps how aggressive a pass can be, so growing coverage is part of staying agent-friendly, not a separate track.

## Convention entries

Ready to drop into an architecture brief (format per [craftsmanship.md](craftsmanship.md)):

- **Dead code:** Boundary: all packages. Failure mode: agents grep dead helpers, treat them as live conventions, and extend them. Enforcement: `knip` in pre-commit and CI. Owner: platform/tooling.
- **Legacy marker:** Boundary: paths listed in `docs/legacy.md`. Failure mode: agents copy deprecated patterns into new code. Enforcement: CI grep asserting every file under a listed path carries the LEGACY marker. Owner: the team that owns the migration.
- **File size:** Boundary: all source files. Failure mode: agents burn tokens on chunked reads and revisit the file per task. Enforcement: eslint `max-lines` at ~400 with per-file overrides requiring a comment. Owner: each package.
- **Duplication:** Boundary: all packages. Failure mode: fixes land in one copy and drift from the others. Enforcement: `jscpd` threshold in CI. Owner: platform/tooling.
