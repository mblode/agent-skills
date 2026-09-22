# Probe: layout shift

Holds the data response open long enough for the loading state to render, then measures what moved when it resolved. `states-layout-shift` is a delta between two rendered boxes, so the static greps produce candidates and this probe produces the verdict.

Two candidates the greps get wrong in both directions: a skeleton that declares `h-14` still shifts when the loaded row settles at 68px, and a skeleton with no declared height does not shift at all when its parent already reserves the space.

## What it measures

Attributed `layout-shift` entries over the window between navigation and data arrival, plus the before and after height of each container that held a placeholder.

## Running it

```bash
node <skill>/scripts/verify/probe.mjs layout-shift --url <url> --route '**/api/invoices*' \
  --loading-selector '[data-testid=invoice-skeleton]' --loaded-selector '[data-testid=invoice-row]' --container-selector '#invoice-list'
```

## What the script does

Registers a `layout-shift` observer before any page script runs (otherwise the first paint's entries are gone), holds the `--route` response until the loading selector is seen, measures the container, releases the response, waits two frames after the loaded selector appears, and measures again. It delays the data, not the whole network: throttling the shell moves the shift into a window that has nothing to do with the defect. A loading state never observed, or a pattern that matched nothing, returns `unknown`.

Where the app has no test ids, use the loaded content's own selectors.

Run against a production build. In dev the bundler compiles the route on first navigation, and the resulting paint sequence is an artefact of the dev server.

## Reading the result

| Observation | Result |
|---|---|
| Container height changes on data arrival AND a `layout-shift` entry names it | `reproduced`, fail. Report both heights, the delta in px, and the sum of captured shift values (not the session-window CLS metric) |
| Heights differ but no shift entry names the container | Inconclusive from attribution alone; inspect displaced siblings and the capture before deciding |
| Shift entries exist but all name elements below the fold that nobody had scrolled to | Record the observation and viewport; tiering belongs to Audit mode, not this probe |
| Loading and loaded states both observed, no container or sibling movement, and no attributable shift entries | `not-reproduced` for this trigger and viewport |

The same probe covers `perf-image-dimensions-and-priority`: an `<img>` with no intrinsic dimensions shows up as a shift source naming the image, with `from` height 0.

## False positives to guard

- **Shifts with `hadRecentInput`** fall within the recent-input exclusion window. They are excluded from this observer, but can still be unwanted movement. Inspect them separately if the defect follows an interaction.
- **`content-visibility: auto` subtrees** legitimately shift within themselves as they come into view.
- **Font swap** produces a real shift that the loading state did not cause. Attribute it: the source node will be a text container, not the placeholder, and the fix belongs to font loading rather than the skeleton.
- **The harness itself.** A devtools overlay, an injected banner, or a screenshot-time scroll all generate entries. Compare the entry timestamps against the injected delay window and drop anything outside it.
- **A run with no loading state observed at all** means the delay never applied or the data was cached. Assert the skeleton was seen; if it was not, the result is `unknown`, not a pass.

## Evidence to write

`shifts.json` with the entries and their sources, the before and after `boundingBox` per container, and two captures: one with the loading state up, one immediately after resolution. The pair is what makes the finding obvious to a reader who will not read the numbers.
