# Guardrail Tooling

The checks worth wiring, what each catches, and how to scope it. TypeScript-first and Oxlint-first, since the stack default runs Ultracite over Oxlint; each rule names its ESLint or Biome form where a repo runs those instead. The categories are language-agnostic, so swap the tool per ecosystem. Load when choosing and wiring the actual checks.

## Contents

- Pick by failure, not by tool
- The standard set
- Module public-interface boundary
- Layering and package boundaries
- One folder per kind of piece, files over registries
- Order checks by when they fire
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
| Dead code, unused exports and deps | `knip` | Orphaned helpers agents leave behind, then later read as live convention | `ignore`, `ignoreDependencies`, per-workspace `entry` in `knip.json` |
| Copy-paste duplication | `jscpd --threshold <percent>` | Near-duplicate blocks where a fix lands in one copy and the others drift | `ignore` globs and `minTokens` in `.jscpd.json`; `threshold` is the part that fails the run |
| Import cycles | `import/no-cycle` (Oxlint; ESLint via `eslint-plugin-import-x`), or dependency-cruiser's `no-circular` where the repo already runs it | A tangled module graph where a change breaks something non-local | Oxlint's `ignoreTypes` defaults on, so type-only edges do not count; `maxDepth` bounds the walk |
| Module and layer boundaries | `no-restricted-imports` with `patterns` (Oxlint, ESLint, and Biome all take `group` or `regex` plus `message`) | Deep imports across modules, a DAO importing a handler | The linter's `overrides` allowlist naming current offenders |
| Package boundaries in a monorepo | `turbo boundaries` (experimental) | A package importing a sibling's files by relative path, or using a dependency its `package.json` does not declare | `boundaries.tags` in `turbo.json` with `allow` and `deny` per tag |
| File size and complexity | `max-lines` with `max` set explicitly (Oxlint's default is 300), `complexity` | Files too big to read in one pass, so agents chunk-read and revisit | Per-file override requiring a justifying comment |

Two defaults that produce green runs proving nothing:

- `jscpd` exits 0 whatever it finds until `--threshold` (or `threshold` in `.jscpd.json`) is set. A bare `jscpd src` step in CI is a report wearing a gate's clothing.
- `knip` is zero-config for anything its plugins recognise: Next.js routes, Vitest, `package.json` `main` and `bin`, and most tool configs. Declare `entry` only for what no plugin sees (ad-hoc scripts, codegen inputs, custom tool configs). Leave those out and knip reports them and everything only they reach as unused; declare too many and real dead code hides behind them.

- In a turborepo where packages export TypeScript source with no build step, `check-types` and `test` in a dependent package do not hash the source of the packages they import, so a changed contract can replay a cached green. Add a no-op `transit` task that depends on `^transit`, and make those tasks depend on it, so each one's hash includes its dependencies'.

Madge is the tool most answers reach for on cycles. It has had no release since 2024. Prefer the linter rule, which already runs in the edit loop, or dependency-cruiser, which is maintained and covers layering too.

## Module public-interface boundary

Where the repo has feature or domain modules, the rule that pays for itself: a module is reachable from outside only through its root files, while relative imports inside a module stay legal.

```json
// .oxlintrc.json (the same object goes under `rules` in an ESLint flat config)
{
  "rules": {
    "no-restricted-imports": ["error", {
      "patterns": [{
        "regex": "^~modules/[^/]+/[^/]+/",
        "message": "Modules are reachable only through their root files (index.ts, client.ts, server.ts), so internals can be refactored without breaking other modules. Import from ~modules/<name> instead."
      }]
    }]
  }
}
```

Public versus private is then decided by depth rather than by a list: a module's root files are its interface, anything in a subfolder is private, and a new subfolder never needs a config change. A module may expose several small entry points (`index.ts`, `client.ts`, `server.ts`) instead of funnelling everything through one barrel that re-exports a whole subtree. Biome takes the same idea as a gitignore-style `group` (`~modules/*/*/**`) rather than a regex; Oxlint's regex engine has no lookarounds, and this pattern needs none.

Which module may depend on which is a separate concern from what is reachable. Leave layering as its own rule; conflating the two produces a config nobody can reason about.

## Layering and package boundaries

Three shapes, picked by how many relationships the rule has to express:

- **A few layers** (handler, service, dao): `no-restricted-imports` per layer directory, one `overrides` entry per layer with the imports it may not take. Readable at three layers, unreadable at ten modules. Oxlint `overrides` replace a rule's options rather than merging them, so an override that adds one banned pattern silently drops every pattern the base config set: each override restates the full rule config (keep shared patterns in a constant and spread them in), and an exception override resets the rule explicitly. Write that in a comment above `overrides`, because the next editor will assume merging.
- **A dependency matrix across many modules**: dependency-cruiser. `npx depcruise --init` writes `.dependency-cruiser.cjs`; each `forbidden` rule carries a `comment` the reporter prints, so the failure explains itself. Point `options.tsConfig` at the repo's tsconfig or path aliases fail to resolve, the edge is silently dropped, and the rule passes on nothing.

  ```js
  // .dependency-cruiser.cjs
  module.exports = {
    forbidden: [
      { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
      {
        name: "dao-below-handler", severity: "error",
        comment: "DAOs know nothing about transport. Move the logic into the service, or pass the data down.",
        from: { path: "^src/modules/[^/]+/dao/" },
        to: { path: "^src/modules/[^/]+/handler/" },
      },
    ],
    options: { tsConfig: { fileName: "tsconfig.json" } },
  };
  ```

  Run it as `depcruise --config .dependency-cruiser.cjs src`.
- **Across packages in a turborepo**: `turbo boundaries`. It checks the two package-level failures in the table above by default and enforces `turbo.json` tags transitively. It is experimental and sees nothing inside a package, so it complements the import rule rather than replacing it.

Escape hatches, for repos that already made the choice: on Nx, `@nx/enforce-module-boundaries` with `scope:` and `type:` tags; on Feature-Sliced Design, `steiger` with `@feature-sliced/steiger-plugin` rather than hand-written import rules for the layer order.

## One folder per kind of piece, files over registries

Three ownership rules that keep a single-file edit correct without the editor having to hold the rest of the app in mind:

- **One folder per kind of piece.** Every route, job, migration, or feature flag gets its own folder named for its kind (`routes/`, `jobs/`, `migrations/`, `flags/`), discovered by walking the directory rather than declared by hand in a manifest. Adding one is "add a file," never "also update the list."
- **Files, not registries.** Prefer a convention the filesystem can prove, a file at a known path found by a glob, over a central registry that names every instance by hand. A registry is a second place that drifts the moment someone adds a file and forgets to also update it; a file convention has nothing to drift from. Where a registry is genuinely unavoidable (an ordered pipeline, a priority nothing else expresses), the completeness spec under "Structural lint that reflects the filesystem" is what keeps it honest, not the next code review.
- **One writer per stored value, enforced in CI.** Every persisted field, cache entry, or piece of client state has exactly one module that writes it; everything else reads. A second writer is a boundary-lint finding (`no-restricted-imports` or an import-graph rule naming the owning module), not a thing left for a reviewer to notice.

## Order checks by when they fire

Feedback worth more the earlier it arrives, because the person or agent who caused it still has the file open. Wire checks in the order they can fire, and let each rung catch only what the one before it cannot:

1. **Edit time.** The type checker and editor diagnostics: a state that cannot compile.
2. **Build time.** Bundler and compiler failures: a broken import, a missing export, a type error the editor's incremental pass missed.
3. **App start.** A boot-time validation pass (see "The environment contract" below): a wiring or config error that only shows once the process actually starts.
4. **Lint.** The standard set above: structural and stylistic invariants that do not block compilation but do block a merge.
5. **Tests.** Behavior, the slowest and most expensive rung, and the backstop for whatever the first four cannot express.

A check that could fire at edit time but is only wired at the test rung is not wrong, it is an expensive way to say the same thing; move it up when the tooling allows it. Every failure at every rung names the owner or the API to use instead of the one that broke ("Self-explaining failures" in `enforcement-ladder.md`); a message that only says where it failed teaches nothing about how to fix it.

The thesis underneath all of it: a correct edit to the one file the agent has open should keep the whole app correct. One writer per value, a filesystem-provable convention instead of a registry, and checks ordered from cheapest to most expensive are what buy that property back; an app that needs five other files held in mind to make one edit safely has already lost it.

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
npm run codegen
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

Four fields, per the entry format in `brief-conventions.md`: **Boundary** (what it applies to), **Failure mode** (what it prevents), **Enforcement** (what catches a violation), **Owner** (who owns exceptions). A convention that cannot name all four does not belong in the brief.

- **Dead code:** Boundary: all packages. Failure mode: agents grep dead helpers, treat them as live conventions, and extend them. Enforcement: `knip` in pre-commit and CI. Owner: platform/tooling.
- **File size:** Boundary: all source files. Failure mode: agents burn tokens on chunked reads and revisit the file per task. Enforcement: `max-lines` at ~400, per-file overrides requiring a comment. Owner: each package.
- **Duplication:** Boundary: all packages. Failure mode: fixes land in one copy and drift from the others. Enforcement: `jscpd --threshold` in CI. Owner: platform/tooling.
- **Module interface:** Boundary: cross-module imports. Failure mode: a refactor inside one module silently breaks another. Enforcement: `no-restricted-imports` banning subfolder paths, message naming the fix. Owner: each module.
- **Enforcement rung:** Boundary: every check with pre-existing violations. Failure mode: a rule lands red, gets ignored, and the next check inherits the habit. Enforcement: the rung is recorded in the config or CI step, and each check has been observed failing. Owner: platform/tooling.
- **Generated contracts:** Boundary: schema files and committed generated output. Failure mode: agents hand-edit generated files or hand-write shapes the codegen owns. Enforcement: generator-emitted banner plus a CI regenerate-and-diff check. Owner: the schema-owning package.
- **Legacy marker:** Boundary: paths listed in the legacy doc. Failure mode: agents copy deprecated patterns into new code. Enforcement: CI grep asserting every file under a listed path carries the marker. Owner: the team that owns the migration.
