# Evidence and Output

The delta this skill adds to `ui-design`'s finding document, and nothing else. That schema, in its `references/output-adapters.md`, stays the single owner of the finding object, the three counts, the tiers, and the verdict. Two files describing one JSON shape is how the two drift apart, so what follows adds fields and redefines none.

## Table of contents

- [The session block](#the-session-block)
- [The verification block](#the-verification-block)
- [How a probe result changes a finding](#how-a-probe-result-changes-a-finding)
- [Artifacts](#artifacts)
- [The clearing re-run](#the-clearing-re-run)
- [Terminal rendering](#terminal-rendering)
- [Self-check additions](#self-check-additions)

## The session block

One per run, alongside `audit`. Without it a reader cannot tell a clean run from a run that never reached the app:

```json
{
  "session": {
    "driver": "playwright",
    "browser": "chromium 131",
    "buildMode": "production",
    "baseUrl": "http://localhost:3000",
    "routes": [{ "url": "/invoices", "from": "src/app/invoices/page.tsx", "status": 200 }],
    "viewports": [{ "width": 360, "height": 800, "touch": true }, { "width": 1280, "height": 800 }],
    "themes": ["light", "dark"],
    "auth": "seeded-storage-state",
    "dataFixture": "seed/invoices-24",
    "probesRun": ["axe-scan", "target-size", "focus-walk", "failure-injection"],
    "probesSkipped": [{ "probe": "web-vitals", "reason": "dev build only; no production server available" }],
    "artifactDir": ".ui-verification/2026-09-04T0912Z"
  }
}
```

`probesSkipped` is required and is not allowed to be inferred from absence. A probe missing from both arrays is a reporting bug.

## The verification block

Appended to any finding a probe touched:

```json
{
  "verification": {
    "probe": "target-size",
    "route": "/invoices",
    "viewport": { "width": 360, "height": 800, "touch": true },
    "theme": "light",
    "result": "reproduced",
    "observed": { "width": 32, "height": 32, "effectiveHitArea": 32 },
    "expected": { "min": 44 },
    "evidence": [".ui-verification/2026-09-04T0912Z/invoices/target-size/360-light.png",
                 ".ui-verification/2026-09-04T0912Z/invoices/target-size/measurements.json"],
    "reruns": 2,
    "reason": null,
    "clearedBy": null
  }
}
```

| Field | Required when | Description |
|---|---|---|
| `probe` | always | the probe file's name without `.md` |
| `route`, `viewport`, `theme` | always | the exact conditions. A measurement without them is not reproducible |
| `result` | always | `reproduced \| not-reproduced \| unknown` |
| `observed` | result is `reproduced` | the measurement, in units |
| `expected` | when the rule has a threshold | the threshold the measurement is judged against |
| `evidence` | result is `reproduced` or `not-reproduced` | artifact paths that exist on disk |
| `reruns` | always | how many times the probe ran. A reported fail is at least 2 |
| `reason` | result is `unknown` | why the probe could not decide: `auth-required`, `no-route`, `theme-not-applied`, `driver-lacks-interception`, `flaky`, `probe-error` |
| `clearedBy` | after a fix | the re-run that proved the finding gone |

`observed` here replaces the static read's `observed` on the parent finding. That substitution is the deliverable: `h-8 on line 42` becomes `32x32px at 360px width with touch emulation`.

## How a probe result changes a finding

| Probe result | Parent finding |
|---|---|
| `reproduced` | Stays `fail`. `observed` comes from the measurement. Tier is unchanged: tiering is the audit's |
| `not-reproduced` | Withdraw only when the probe exercised the alleged trigger. Record the trigger and measurement in `consideredAndRejected`; otherwise retain an `unknown` finding naming the missing condition |
| `unknown` | Stays as a finding with `result: "unknown"` and the probe's `reason`. It never becomes a `pass` |

A probe that found something no static rule predicted enters as a new finding against the rule it is primary for. Where no rule owns it, use `axe:<violation-id>` or `runtime:<signature>` as the `rule` value and say in the text that it came from the browser rather than from the corpus. Do not stretch a rule id to make a browser finding look like a predicted one.

## Artifacts

```text
.ui-verification/<run-id>/<route-slug>/<probe>/<width>-<theme>.png
.ui-verification/<run-id>/<route-slug>/<probe>/<name>.json
```

Mechanical naming, because these get compared across runs more than they get read once. Add the directory to the repo's ignore file if it is not already covered; a verification run that leaves a hundred screenshots in the working tree ends up committed.

Every path in an `evidence` array exists on disk when the report is written. A cited artifact that was never saved is worse than no citation: it reads as verified and cannot be checked.

## The clearing re-run

A fix is proved by the probe, not by the diff. Re-run with every condition identical: route, viewport, theme, seed, injected failure, build mode.

```json
{
  "clearedBy": {
    "ranAt": "2026-09-04T09:41:00Z",
    "result": "not-reproduced",
    "observed": { "width": 48, "height": 48 },
    "evidence": [".ui-verification/2026-09-04T0941Z/invoices/target-size/360-light.png"]
  }
}
```

Keep the before artifact. Writing the after capture over the before is how a report loses its own argument. A re-run that still reproduces is recorded as `clearedBy.result: "reproduced"` on an `applied` finding, which is the evidence `ui-design`'s revert-on-failed-fix rule runs on.

## Terminal rendering

Same adapter, two additions:

- Each reproduced finding gains one line under its fix line: `Probe: <probe> · <route> · <width>px <theme> · <observed>`.
- The footer gains a session line before the defer-to block: driver, build mode, routes, probes run, probes skipped with reasons.
- `SHIP VERDICT` is omitted on a standalone run, per SKILL.md.

## Self-check additions

Added to the audit's existing codes:

```text
"probe-not-run"            // a finding claims a probe that is absent from session.probesRun
"evidence-missing"         // a cited artifact path does not exist on disk
"single-run-fail"          // a reproduced finding with reruns < 2
"conditions-not-recorded"  // a verification block missing route, viewport, or theme
"cleared-without-rerun"    // applied: true on a probed finding with no clearedBy
"unknown-as-pass"          // a probe returned unknown and the finding was dropped
```

`unknown-as-pass` is the one that matters. Every other failure mode here makes the report weaker; that one makes it wrong, by converting "we could not check" into "we checked and it was fine".
