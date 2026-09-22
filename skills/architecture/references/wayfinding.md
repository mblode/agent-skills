# Wayfinding and Contagion Markers

Agents arrive by grep, not by reading documentation, and mimic whatever code they read first. Make the right thing cheap to find, and put a marker at the code site of anything that must not be copied or edited. The instruction file and the docs index that point here are `gates`.

## Contents

- Naming and locality
- Add-a-new-X recipes
- Legacy quarantine
- Deprecation greps
- Generated contracts
- Deliberate simplifications
- Dormant config

## Naming and locality

- Name files for what someone would grep first: `invoice-refunds.ts`, not `utils2.ts`.
- Keep files small enough to read in one pass; the file-size lint cap doubles as a traversal budget.
- Co-locate code that changes together. A feature spread across six directories is six reads before the first edit.
- One canonical name per concept; the glossary format is in `domain-language.md`.

## Add-a-new-X recipes

One file (`docs/knowledge/common-workflows.md` or local equivalent) holding numbered recipes for the additions this codebase makes over and over: a module, a screen and route, an RPC and its generated client, a job, a feature flag, a tenant-scoped table.

- Ten steps or fewer per recipe; longer means the thing itself needs simplifying.
- Exact files and exact commands: `src/modules/index.ts` plus the line to add, not "register it in the manifest".
- Link out for depth rather than duplicating prose.
- Trace every recipe against real code before publishing, and grep-verify every path. A recipe written from memory names files that moved, and the agent follows the stale pointer with full confidence.

Acceptance is behavioural: a fresh-context agent follows one recipe end to end with no further guidance. If it stalls or asks, a step is missing. In a rebuild, the first vertical slice is the source of the first recipes.

## Legacy quarantine

1. **A greppable marker at the top of the frozen file**, the load-bearing layer:

   ```ts
   // LEGACY: do not use as a reference or extend. See docs/legacy.md
   ```

2. **A short `docs/legacy.md`** naming each frozen area, why, and what to use instead. The replacement is the part that redirects.
3. **A lint rule on the deprecated import**, at the rung the enforcement ladder picks rather than a default `warn`.

Add a check asserting every file under a quarantined path carries the marker. Never leave an unmarked old/new dual path: two ways to fetch the same data read as two valid conventions. Quarantine whole directories where that is the natural seam.

## Deprecation greps

A grep check per removed API, command, or package, where each hit prints the sanctioned replacement. Exclude changelogs and historical docs; they are the record.

## Generated contracts

Anything derivable from a schema (RPC clients, protobuf messages, Prisma client, API types) is generated, never hand-written:

- The schema is the single source of truth; import generated types, never hand-write a shape codegen owns.
- Commit the generated output where the toolchain allows, so any checkout has real types without running codegen; otherwise codegen is a declared task every other task depends on.
- The generator emits the banner itself, naming the regeneration command:

  ```ts
  // GENERATED FILE. DO NOT EDIT. Run `npm run codegen` to regenerate.
  ```

- A regenerate-and-diff check plus a breaking-change check against the published schema (for Buf, `buf breaking`).

## Deliberate simplifications

Code knowingly simpler than the problem reads as finished work to extend or a bug to fix. Mark it with the ceiling and the upgrade path:

```ts
// SIMPLIFIED: in-memory, single process. Fine to ~10k queued items.
// Move to the outbox table (see docs/adr/0012) before multi-instance deploy.
```

The ceiling is the load-bearing half. The marker is for corners cut on purpose, and never for the floor (validation at trust boundaries, data-loss error handling, tenant isolation, security, accessibility): a simplification that cuts one of those is a bug wearing a marker.

## Dormant config

A config file, script, or devDependency nobody invokes reads as live convention. One pointing at a renamed file produces a confident empty result instead of an error. Delete it with its dependency; revival is a ticket, not a file left in the tree.
