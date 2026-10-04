# Maintain Mode

Use and extend a harness that already exists: the outcome-based loop (source wave, live pass, ship or stop), plus the scoped-proof rule and proof record that make "covered" a checkable claim rather than an impression.

## Contents

- [Pick one outcome](#pick-one-outcome)
- [Scope](#scope)
- [Steps](#steps)
- [Scoped proof](#scoped-proof)
- [The proof record](#the-proof-record)
- [Bug investigation](#bug-investigation)

## Pick one outcome

State which one this run produced, every time:

- **Clean.** Doctor passed, the live pass found nothing wrong, nothing needed changing.
- **Changed.** One PR or commit landing proven corrections to the harness itself (a stale selector, a feature file describing a path the app no longer has, a doctor check that stopped detecting what it claims to).
- **Blocked.** Name exactly what blocked it: doctor failed and could not be fixed in one retry, a dependency is unreachable, an isolation guarantee could not be confirmed.

## Scope

This mode edits the harness (feature files, `doctor`, `seed`, `verify`, their fixtures). It does not edit product code. Doc drift (a feature file describing a path that moved) gets fixed in the map. A genuinely broken app (a path that used to work and now does not) gets reported per `references/bug-handoff.md`, never quietly worked around inside the harness so the run reports green.

## Steps

0. **Doctor first.** Every session, before the first drive, and again after any failed drive. A doctor failure caused by harness drift (a stale port, a migration nobody ran) gets fixed and retried once before calling the run `blocked`.
1. **Locate the harness.** The skill folder in the target repo per the main `SKILL.md`'s contract; if it is missing, this is Create mode, not Maintain.
2. **Index hygiene.** `features/README.md` (or equivalent) lists every feature file that exists, and nothing else.
3. **Source wave.** One read-only pass per feature file: read the current source the feature describes, flag drift against the feature file with a citation (the file and line that no longer matches), and propose one corrected recipe. This pass never drives the app and never edits a file; it only reads and reports, which is what lets it run over every feature file at once without instances colliding.
4. **Reconcile.** Merge overlapping proposals from the source wave, spot-check the drift each one cites against the actual file, and sweep recent commits for a feature that changed with no corresponding update to its map entry.
5. **Live pass, required even when the source wave found nothing.** Drive every path the feature file lists against a real isolated instance, cheapest method first: `cli`/`api` checks for fast failure, then browser, then computer-use checks one at a time (`references/verification-ladder.md`). This is the pass that catches what reading source cannot: a selector that still exists in code but no longer renders, a route that 404s despite the handler being present, a keyboard shortcut a newer keybinding silently shadowed.
6. **Triage each finding** into doc drift (fix the map), harness gap (the doctor or verify check itself needs correcting), or product gap (report it, do not fix it here).
7. **Ship or stop.** One PR or commit for `changed`, re-reading every file it touches before opening it; or state the `blocked` reason plainly.

## Scoped proof

A proof is a claim, and like any claim it needs to say what it excludes as clearly as what it covers.

- **Every path in scope gets a check or a named skip.** A feature file lists every user-reachable path under a feature; `verify` reports each one as covered, failed, or skipped-with-a-reason. A path with none of the three is a bug in the harness, not an acceptable gap.
- **One way in is not proof of the feature.** If a feature ships a button, a keyboard shortcut, and a CLI equivalent for the same action, checking only the button is incomplete even when it passes; list all three as separate paths and check each, or explicitly skip the ones you are not checking with a reason a reader can act on ("CLI equivalent untested; no fixture for the interactive prompt yet" is a reason; "not needed" is not).
- **A skip with no reason invalidates the whole proof, not just that line.** Treat a bare "skipped" the way a `--ci` run treats an uncovered path: as a failure of the proof, not a footnote on it. A `manual` path is still a skip, and its reason is the concrete blocker (`references/verification-ladder.md`).
- **A proof is enough to act on only when:** it was produced against the exact revision it claims to cover (`dirty: false` below, or the local edits named), nothing failed, no changed source file is uncovered, and at least one feature was actually driven this run. Anything short of that is a partial result and should be reported as one.

## The proof record

`verify` writes one JSON file per run to a fixed, gitignored path (for example `.verify/proof.json`), so a reviewer, a CI step or another agent reads the same record instead of scrolling a terminal:

```json
{
  "sha": "<HEAD at run time>",
  "base": "<merge base the diff was taken from>",
  "since": "origin/main",
  "dirty": false,
  "mode": "full",
  "changed": 12,
  "ok": true,
  "features": [
    {
      "id": "notes",
      "file": "src/features/notes/feature.json",
      "files": ["src/features/notes/create.ts"],
      "methods": ["cli", "browser"],
      "covered": ["create via button", "create via cli"],
      "skipped": [{ "path": "create via shortcut", "reason": "no check in feature.json" }],
      "failed": [],
      "checks": [{ "path": "create via cli", "method": "cli", "command": "...", "exitCode": 0, "ms": 840 }]
    }
  ],
  "uncovered": [],
  "exempt": ["README.md"]
}
```

Aggregate per user path, not per check:

- **Covered** only when at least one of its checks ran and every check that ran passed.
- **Failed** when any check that ran failed; the entry names the command and exit code.
- **Skipped**, with the reason, when none of its checks ran (no check listed, `--fast` dropped it, or the method is one `verify` does not drive). A check that did not run is listed as skipped even when another method covered the same path, so the record shows what was not driven.

`ok` is false on any failed check or any uncovered source file; exempt files never flip it. `dirty` records whether the working tree had uncommitted changes when it ran, so a reader can tell a proof of `sha` from a proof of `sha` plus local edits. `mode` is `fast` or `full`. Never hand-edit a proof; re-run `verify`.

## Bug investigation

A bug report routes here, not to Create mode. Reproduce in an isolated instance before doing anything else, then hand off per `references/bug-handoff.md`. The report is the trigger for a targeted `verify --feature <id>` run against the feature the report maps to, not a reason to run the whole maintenance loop.
