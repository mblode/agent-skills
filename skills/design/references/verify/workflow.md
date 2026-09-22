# Verify Mode

Boot the app, drive it with a browser, and run the probes that decide a rule at runtime: computed boxes, injected failures, observed layout shift, a scripted Tab walk, an axe scan per theme. Output is findings keyed to rule IDs with reproducible evidence, plus the clearing re-run after a fix. A static audit reports what the code will probably do; it cannot see a 40px control whose hit area a pseudo-element already expands to 44, or a retry button wired to nothing. This mode reproduces or kills each of those.

Not here: tiering and the ship verdict (Audit mode), a durable test suite (write Playwright tests in the repo), pixel baselines (Chromatic, Percy), field performance (RUM or CrUX).

## Contents

- When to run
- Running a probe
- Steps
- Deciding a finding
- Clearing re-run
- Honesty rules
- Gotchas

## When to run

| Situation | What to do |
|---|---|
| An audit emitted findings and the user wants them confirmed | Run only the probes those rule IDs map to in `rule-coverage.md` |
| No audit ran; the user points at a route or a running app | Detect features, run the battery that surface earns |
| A fix just landed for a reproduced finding | The clearing re-run only |
| Captures across themes or widths | `theme-capture` at each condition |
| A `design-system.md` claims a scale | Read the claimed values off computed styles on a real page |

## Running a probe

```bash
node <skill>/scripts/verify/probe.mjs <probe> --url http://localhost:3000/invoices [options]
```

Run it from the application's repository: Playwright, `@axe-core/playwright` (or `axe-core`), and `web-vitals` resolve from there, so the browser matches the repo's tests, and nothing is installed. The header of `probe.mjs` lists every option. It writes artifacts under `.ui-verification/<run-id>/<route>/<probe>/` before printing one JSON object: conditions, raw measurement, mechanical candidates, evidence paths, and `unknown` with a reason when it could not decide (auth redirect, theme not applied, route pattern never matched, driver missing). Reading the measurement against the rule is yours, with the probe's reference in `probes/`.

Probes, one condition each (one route, one viewport, one theme per run): `axe-scan`, `target-size`, `focus-walk`, `viewport-stress`, `console-network`, `failure-injection`, `layout-shift`, `web-vitals`, `theme-capture`. Without a Playwright install the script returns `unknown` with reason `driver-unavailable`; fall back to the host's browser tools and follow the probe reference by hand. `failure-injection`, `layout-shift`, and `web-vitals` need request interception and do not exist under a driver without it.

## Steps

1. Establish the session (`session-setup.md`): driver, build mode, base URL, auth, resolved routes. Stop if the app will not boot; a run with no session is a reportable outcome, not a clean bill of health.
2. Select probes. Handed rule IDs: take each one's probe from `rule-coverage.md`; IDs with no probe pass through as source-only. Given only routes: `axe-scan`, `console-network`, and `viewport-stress` run on every route, plus the probes the detected features earn. Budget the matrix: two viewports (360 and 1280) and two themes cover the ground.
3. Run each probe; evidence is on disk before you interpret it.
4. Decide each finding (below). Repeat timing-sensitive or inconsistent results; a deterministic captured failure needs no ritual second run.
5. Re-run the identical probe for each fix and record `clearedBy`.
6. Emit the `session` and `verification` blocks (`evidence-output.md`) and run `scripts/audit/check-report.mjs` on the document.
7. List every probe skipped and why. A probe that could not run is never a pass.

## Deciding a finding

| Outcome | Meaning | Effect on the handed-over finding |
|---|---|---|
| `reproduced` | The probe measured the defect | Stays `fail`, now carrying `observed` from the measurement |
| `not-reproduced` | The tested conditions did not exhibit it | Withdraw only if the probe exercised the alleged trigger; otherwise keep the candidate with the missing condition named |
| `unknown` | The probe could not run or decide | Survives as `unknown` with the reason. Never converts to a pass |

A race finding tested with one request, or a layout-shift finding where the loading state was never seen, did not exercise its trigger. Where a probe finds something no rule predicted, emit it against the rule the probe is primary for, or as `axe:<id>` or `runtime:<signature>`, saying it came from the browser. Standalone, render the terminal adapter without `SHIP VERDICT`: printing one from probe results alone invents a tier assignment nobody made.

## Clearing re-run

A fix is proved by the probe, not the diff. Same route, viewport, theme, seed, injected failure, and build mode. Keep the before artifact (a new `--run-id` guarantees it). Still failing: report applied-unverified and say so. Passing while another probe on the same route now fails: that is a new finding, not a footnote.

## Honesty rules

- A skipped probe is not a passed probe. Report every probe that did not run, with the reason.
- A screenshot is evidence, not a verdict. Captures let a human check the measurement, and settle the two questions no measurement does: whether the dark theme looks right, and whether a pseudo-locale broke the layout or merely the prose.
- The app is the subject, not the harness. A selector that never resolved or an interception that swallowed the wrong request is a probe bug: fix the probe and re-run.
- Numbers carry units and conditions. `44x44px at 360px width with touch emulation` is a measurement; `too small` is the inference this mode replaces.

## Gotchas

- `emulateMedia({ colorScheme: 'dark' })` does nothing for an app that themes with `class="dark"` or `data-theme`, which is most Tailwind apps. `probe.mjs` returns `theme-not-applied` unless the attribute landed; pass `--theme-storage` or `--theme-click` to drive the app's own toggle, or `--theme-media-only` when the app really is media-driven.
- Perf or layout-shift probes against `next dev` measure on-demand compilation. Use a production build.
- Animations that never settle hold a screenshot until timeout. `probe.mjs` sets reduced motion; run motion-sensitive checks in a separate pass with it off, because reduced motion is also a code path that can break.
