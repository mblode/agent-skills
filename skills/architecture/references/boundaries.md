# Boundary Checks

The structural checks this skill owns, how to land one in a repo that already violates it, and how to prove it works. TypeScript-first and Oxlint-first; each rule names its ESLint or Biome form where a repo runs those. Wiring into hooks, CI, and verification tiers is `gates`.

## Contents

- Pick by failure, not by tool
- The standard set
- Module public-interface boundary
- Layering and package boundaries
- Structural specs over the filesystem
- Regenerate-and-diff staleness gates
- The enforcement ladder
- Never hand-roll a baseline
- Negative fixtures: prove it bites
- Self-explaining failures
- Convention entries

## Pick by failure, not by tool

Name the two or three failures this repo actually exhibits, then pick the check. Installing the full set at once produces a wall of violations and forces the weakest rung on all of them.

## The standard set

| Category | Tool | Catches | Native scoping |
|---|---|---|---|
| Module and layer boundaries | `no-restricted-imports` with `patterns` (`group` or `regex` plus `message`) | Deep imports across modules, a DAO importing a handler | Linter `overrides` naming current offenders |
| Dependency matrix, cycles | dependency-cruiser, or `import/no-cycle` | A tangled graph where a change breaks something non-local | `pathNot`; `options.tsConfig` required |
| Package boundaries | `turbo boundaries` (check its current status live) | A package importing a sibling's files by relative path, or an undeclared dependency | `boundaries.tags` in `turbo.json` |
| Dead code, unused exports and deps | `knip` | Orphaned helpers agents later read as live convention | `ignore`, `ignoreDependencies`, per-workspace `entry` |
| Duplication | `jscpd --threshold <percent>` | Near-duplicate blocks where a fix lands in one copy | `ignore`, `minTokens`; `threshold` is what fails the run |
| File size and complexity | `max-lines` with `max` set explicitly, `complexity` | Files too big to read in one pass | Per-file override with a justifying comment |

Defaults that produce green runs proving nothing:

- `jscpd` exits 0 whatever it finds until a threshold is set.
- `knip` is zero-config for anything its plugins recognise. Declare `entry` only for what no plugin sees; too many entries hide real dead code.
- dependency-cruiser without `options.tsConfig` cannot resolve path aliases, drops those edges, and passes every rule on half a graph.
- `turbo boundaries` sees nothing inside a package; it complements the import rule, never replaces it.
- Before adding any graph tool, check its release activity; prefer the linter rule that already runs in the edit loop, or dependency-cruiser, over a dormant tool.

## Module public-interface boundary

A module is reachable from outside only through its root files; relative imports inside a module stay legal.

```json
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

Public versus private is decided by depth, not a list: root files are the interface, subfolders are private, and a new subfolder needs no config change. Biome takes the same idea as a `group` glob (`~modules/*/*/**`). Which module may depend on which is a separate rule; conflating the two produces a config nobody can reason about.

## Layering and package boundaries

- **A few layers** (handler, service, dao): one `overrides` entry per layer directory with the imports it may not take.
- **Many modules**: dependency-cruiser `forbidden` rules, each with a `comment` the reporter prints, and `options: { tsConfig: { fileName: "tsconfig.json" } }`.
- **Across packages**: `turbo boundaries` tags, alongside the import rule.
- Repos that already chose Nx use `@nx/enforce-module-boundaries`; Feature-Sliced Design repos use `steiger`.

## Structural specs over the filesystem

A test that walks the tree and asserts invariants no off-the-shelf tool provides: directory and file naming, required files per module, generated-file banners, and registry completeness (every route has an auth policy, every table is in the deletion sweep, every handler type is registered). It rides the existing test command, and the assertion is the doc. Land it with its existing violations fixed.

## Regenerate-and-diff staleness gates

Anything derived from a source of truth (RPC clients from Buf, Prisma client, API types, docs from code) gets a step that re-derives it and fails on a dirty diff, such as `npm run codegen && git diff --exit-code -- <generated paths>`. When the upstream schema is unreachable on pull requests, gate against a committed snapshot and say so in the step name.

## The enforcement ladder

Take the first rung that holds for the violations that already exist, and write down which rung and why in the config or step itself.

1. **Fix the violations and block.** More often reachable than it looks: run the tool before assuming otherwise.
2. **Scope with the tool's own config** (`knip.json` `ignore`, jscpd `ignore`, dependency-cruiser `pathNot`). Not the linter's `ignorePatterns`: that removes the files from every rule, not the one you are adding, except for directories that should be unlinted anyway (generated, vendored).
3. **Allowlist in the linter** with an `overrides` entry naming current offenders by explicit path, never a glob, at `error`. Prefer that over a blanket `warn`, which fails to block the next violation.
4. **Report-only**, when nothing else holds. The wiring is done for the day someone burns the list down.

Ship it green: land the rule and the fix for its existing violations in the same change. A rule that ships red teaches everyone that checks are noise.

## Never hand-roll a baseline

Do not write a guard script plus a committed baseline (`*-ratchet.mjs` and `*.baseline.json`) that fails when a violation count grows. Every tool in the category already ships rungs 2 and 3, and under deadline the cheapest green is a bigger number in the baseline. A genuinely bespoke invariant is a structural spec using rung 1 or 3, not a count file.

## Negative fixtures: prove it bites

Each boundary rule ships with a committed negative fixture: a small file or fixture package that violates exactly that rule, and a test asserting the check fails on it with the expected message. The fixture lives outside the production source globs (or is excluded from them by the check's own config) so the real run stays green.

1. The check passes on the repo.
2. The check fails on the fixture, and the message names the fix.
3. Removing the rule makes the fixture test fail.

The fixture is the proof that survives the session: a glob that matches nothing, an alias the tool cannot resolve, or a rule under a config section the runner never reads all produce a green run that proves nothing, and the fixture test turns each into a red one. A boundary doc lists only rules that have a fixture; a script or doc claiming more enforcement than its fixtures prove is the failure to look for first.

## Self-explaining failures

Every violation message states why the invariant exists and how to fix it:

```
src/modules/billing/lib/invoice.ts is imported from src/modules/orders/checkout.ts.
Modules are reachable only through their index.ts, so internals can be
refactored without breaking other modules. Import from ~modules/billing instead.
```

Where a rule cannot carry a message (`max-lines` takes none), put the explanation in a comment above the rule in the config.

## Convention entries

Four fields each, per the brief format: Boundary, Failure mode, Enforcement, Owner.

- **Module interface:** cross-module imports; a refactor inside one module breaks another; `no-restricted-imports` banning subfolder paths plus its negative fixture; each module.
- **Layering:** handler, service, dao directories; a DAO reaches transport or request objects; per-layer overrides or dependency-cruiser plus fixtures; platform.
- **Dead code:** all packages; agents extend dead helpers; `knip`; platform.
- **Duplication:** all packages; fixes land in one copy; `jscpd --threshold`; platform.
- **File size:** all source files; chunked reads and revisits; `max-lines` with overrides requiring a comment; each package.
- **Generated contracts:** schemas and committed output; hand-edited generated files; generator-emitted banner plus regenerate-and-diff; the schema owner.
