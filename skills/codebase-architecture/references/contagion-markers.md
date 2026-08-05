# Contagion Markers

Agents mimic whatever code they read first, and they arrive by grep rather than by reading documentation. Anything that must not be copied, or must not be edited, needs a marker at the code site. Load when the repo has legacy, generated, or dual-path code.

## Legacy quarantine

Mixed-quality code teaches the wrong conventions, and deleting legacy is not always an option. Quarantine what stays, in three layers:

1. **A greppable marker in the frozen file itself**, at the top:

   ```ts
   // LEGACY: do not use as a reference or extend. See docs/legacy.md
   ```

   This is the load-bearing layer. An agent that greps for a symbol and lands in the middle of an old module never opens the doc, so the warning has to be where it lands.

2. **A short `docs/legacy.md`** naming each frozen area, why it is frozen, and **what to use instead**. The replacement is the part that matters: "react-final-form is frozen, use react-hook-form" redirects, "this is legacy" only discourages.

3. **A lint rule** on the deprecated import or package, so the redirect fires at the moment of temptation rather than in review. Pick its severity from the enforcement ladder like any other check rather than defaulting to `warn`: a handful of importers is a rung-1 fix-and-block, and `warn` is right only when the list is too long to clear now.

State the marker convention once in the instruction file, so agents know what it means before they hit one, and add a CI grep asserting every file under a quarantined path carries the marker. Without it the convention is true on the day you write it and decays from the next file added.

Two further rules:

- **Never leave an unmarked old/new dual path.** A deprecated endpoint next to its replacement, or two ways to fetch the same data, reads as two valid conventions. Delete the old path or mark it.
- **Quarantine whole directories where that is the natural seam.** A `test-legacy/` folder marked "archived, do not add to, not a source of truth" keeps an old suite runnable without teaching its patterns.

## Deprecation greps

Removed APIs, commands, and packages must not reappear in active code or docs. A grep check per removed item, where each hit prints the sanctioned replacement, catches the reintroduction that a linter cannot express.

Exclude changelogs and historical docs: they are the record, and failing on them trains people to stop writing them.

## Generated contracts

Anything derivable from a schema (API clients, GraphQL types, protobuf messages, DB models) is generated, never hand-written, so no copy can drift:

- **Make the schema the single source of truth** and state the rule in the instruction file: import generated types, never hand-write a shape the codegen already owns.
- **Commit the generated output.** Agents then read real types on any checkout without knowing how to run codegen.
- **Banner every generated file, from the generator itself**, not by hand:

  ```ts
  // GENERATED FILE. DO NOT EDIT. Run `yarn codegen` to regenerate.
  ```

  Emit it from the generator's config (`prepend`, `afterOneFileWrite`, or the equivalent) so it cannot be lost on the next regeneration. Naming the regeneration command matters as much as the warning: it puts the agent's next action in the message rather than sending it to look one up.

- **Gate contract changes in CI:** a regenerate-and-diff check that the committed output still matches the schema, plus a breaking-change check against the published schema.

The banner is the same contagion defense as the LEGACY marker, pointed at the opposite failure: one says do not copy this, the other says do not edit this.

## Deliberate simplifications

The third marker, and the one most repos lack. Code that is knowingly simpler than the problem (the in-memory queue that will need a real one, the O(n²) loop that is fine at current volume, the single-region assumption) reads to an agent as either finished work to extend or a bug to fix. Both are wrong, and both are expensive.

Mark it at the code site with the ceiling and the upgrade path, so the next reader learns when it stops being correct rather than whether it is:

```ts
// SIMPLIFIED: in-memory, single process. Fine to ~10k queued items.
// Move to the outbox table (see docs/adr/0012) before multi-instance deploy.
```

The ceiling is the load-bearing half. "This is a simplification" invites a rewrite nobody asked for; "fine to 10k, then do X" is a decision the reader can check against reality.

Two rules keep it honest: the marker is for corners cut on purpose, never for a shortcut you would be embarrassed to name, and it is not a substitute for the things that are never simplified (validation at trust boundaries, error handling that prevents data loss, security, accessibility). A simplification that cuts one of those is a bug wearing a marker.

## Dormant config

A config file, script, or devDependency nobody invokes is a contagion source in its own right. An agent reads it as live convention and extends it, or runs it and trusts the result.

Worse when it points at something that does not exist: a lint config aimed at a `tsconfig` that was renamed produces a confident empty result rather than an error, so the check appears to pass while covering nothing.

Delete dormant config and its dependency together. If it is meant to be revived, that is a ticket, not a file left in the tree.
