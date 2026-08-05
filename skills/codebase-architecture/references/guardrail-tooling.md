# Guardrail Tooling

The checks worth wiring, what each catches, and how to scope it. TypeScript-first; the categories are language-agnostic, so swap the tool per ecosystem. Load when choosing and wiring the actual checks.

## Contents

- Pick by failure, not by tool
- The standard set
- Module public-interface boundary
- Structural lint that reflects the filesystem
- Regenerate-and-diff staleness gates
- The environment contract
- Scheduled cleanup passes
- Convention entries for the brief

## Pick by failure, not by tool

Name the failure this repo actually exhibits, then pick the check. Installing the full set in one pass produces a wall of violations, forces the weakest enforcement rung on all of them, and trains everyone to skip hooks.

## The standard set

| Category | Tool | Catches | Native scoping |
|---|---|---|---|
| Dead code, unused exports and deps | `knip` | Orphaned helpers agents leave behind, then later read as live convention | `ignore`, `ignoreDependencies` in `knip.json` |
| Copy-paste duplication | `jscpd` | Near-duplicate blocks where a fix lands in one copy and the others drift | ignore globs, threshold |
| Import cycles | `madge --circular` | A tangled module graph where a change breaks something non-local | exclusions; set `skipTypeImports` so type-only edges do not count |
| Import boundaries | eslint `no-restricted-imports`, `dependency-cruiser` | Layer violations (a DAO importing a handler), deep imports across modules | `overrides` allowlist, or `warn` before `error` |
| File size and complexity | eslint `max-lines` (~400), `complexity` | Files too big to read in one pass, so agents chunk-read and revisit | per-file override requiring a justifying comment |

`knip` needs its entry points declared to be useful: app entries, screens or routes, package barrels, scripts, and tool configs (test runner, codegen). Without them it reports the entire tree as unreachable and the run is discarded as noise.

## Module public-interface boundary

Where the repo has feature or domain modules, the rule that pays for itself: a module is reachable from outside only through its `index.ts`, while relative imports inside a module stay legal.

```js
// eslint no-restricted-imports
{ group: ["~modules/*/!(index)", "~modules/*/*"],
  message: "Modules are reachable only through their index.ts, so internals can be refactored without breaking other modules. Import from ~modules/<name> instead." }
```

Public versus private is then decided by depth rather than by a list: a module's root files are its interface, anything in a subfolder is private, and a new subfolder never needs a config change. A module may expose several small entry points (`index.ts`, `client.ts`, `server.ts`) instead of funnelling everything through one barrel that re-exports a whole subtree.

Which module may depend on which is a separate concern from what is reachable. Leave layering as its own rule; conflating the two produces a config nobody can reason about.

## Structural lint that reflects the filesystem

The highest-leverage check for a repo with a naming or shape convention, and the one no off-the-shelf tool provides. A test spec walks the tree and asserts the invariants:

- Directory naming (kebab-case under `src/modules`, no exceptions list).
- File naming and required files per module.
- Generated-file banners present wherever generated output lands.
- Registry completeness: where every X must be registered (tools in a manifest, tables in a deletion sweep, routes with an auth policy), the spec reflects over the real code and fails when an item is missing from the registry. Nothing can be added without declaring it.

Two properties make this worth writing by hand:

- **It rides the existing test command**, so it needs no extra CI wiring, no new script, and no separate failure surface to explain.
- **The assertion is the doc.** A prose convention drifts from the code silently; a spec that walks the same filesystem cannot.

Ship it with its existing violation fixed in the same change, including the import and alias updates a directory rename implies.

## Regenerate-and-diff staleness gates

Anything derived from a source of truth gets a CI step that re-derives it and fails on a dirty diff:

```bash
yarn codegen
git diff --exit-code src/generated
```

Applies to codegen output, API and RPC clients, docs generated from code, lockfiles, and schema snapshots. It is the only check that catches the specific failure of someone editing generated output by hand, or changing the schema and committing without regenerating.

When the upstream schema is not reachable on pull requests, gate against a committed snapshot instead and state the reduced coverage in the step's own name or comment, so nobody later reads a passing gate as full coverage.

## The environment contract

`.env.example` is the canonical list of environment variables, and a static check keeps it honest: scan source for environment reads (`process.env`, the config library's accessor) and fail when a referenced key is not listed, naming the missing key.

Prefer the static scan over boot-time validation. It runs in CI without booting the app, and it works in repos with no dependency-injection boot to hook. Where the app does boot in CI, a boot check that constructs the wiring while loading `.env.example` covers both at once.

## Scheduled cleanup passes

Agent-written code accretes single-use helpers, stale dual paths, and bloated files even with every check above wired. Small scheduled passes beat waiting for a rewrite:

1. Run the dead-code and duplication tools; delete what they flag.
2. Split any file over the size cap along its natural seams.
3. One slice at a time, verified by the existing suite. Never big-bang.

Refactor safety equals test coverage: a thin suite caps how aggressive a pass can be, so growing coverage is part of staying agent-ready rather than a separate track. Run `tidy` for the diff-scoped version of this.

## Convention entries for the brief

Four fields, per the entry format in `craftsmanship.md`: **Boundary** (what it applies to), **Failure mode** (what it prevents), **Enforcement** (what catches a violation), **Owner** (who owns exceptions). A convention that cannot name all four does not belong in the brief.

- **Dead code:** Boundary: all packages. Failure mode: agents grep dead helpers, treat them as live conventions, and extend them. Enforcement: `knip` in pre-commit and CI. Owner: platform/tooling.
- **File size:** Boundary: all source files. Failure mode: agents burn tokens on chunked reads and revisit the file per task. Enforcement: eslint `max-lines` at ~400, per-file overrides requiring a comment. Owner: each package.
- **Duplication:** Boundary: all packages. Failure mode: fixes land in one copy and drift from the others. Enforcement: `jscpd` threshold in CI. Owner: platform/tooling.
- **Module interface:** Boundary: cross-module imports. Failure mode: a refactor inside one module silently breaks another. Enforcement: `no-restricted-imports` banning deep paths, message naming the fix. Owner: each module.
- **Enforcement rung:** Boundary: every check with pre-existing violations. Failure mode: a rule lands red, gets ignored, and the next check inherits the habit. Enforcement: the rung is recorded in the config or CI step, and each check has been observed failing. Owner: platform/tooling.
- **Generated contracts:** Boundary: schema files and committed generated output. Failure mode: agents hand-edit generated files or hand-write shapes the codegen owns. Enforcement: generator-emitted banner plus a CI regenerate-and-diff check. Owner: the schema-owning package.
- **Legacy marker:** Boundary: paths listed in the legacy doc. Failure mode: agents copy deprecated patterns into new code. Enforcement: CI grep asserting every file under a listed path carries the marker. Owner: the team that owns the migration.
