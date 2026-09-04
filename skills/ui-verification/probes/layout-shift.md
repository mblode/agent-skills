# Probe: layout shift

Holds the data response open long enough for the loading state to render, then measures what moved when it resolved. `states-layout-shift` is a delta between two rendered boxes, so the static greps produce candidates and this probe produces the verdict.

Two candidates the greps get wrong in both directions: a skeleton that declares `h-14` still shifts when the loaded row settles at 68px, and a skeleton with no declared height does not shift at all when its parent already reserves the space.

## What it measures

Attributed `layout-shift` entries over the window between navigation and data arrival, plus the before and after height of each container that held a placeholder.

## Recipe

Register the observer before any script runs, or the entries for the first paint are already gone:

```js
await page.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({
        value: e.value,
        startTime: e.startTime,
        sources: e.sources.map((s) => ({
          node: s.node?.tagName + (s.node?.id ? '#' + s.node.id : ''),
          from: s.previousRect, to: s.currentRect,
        })),
      });
    }
  }).observe({ type: 'layout-shift', buffered: true });
});
```

Delay the data, not the whole network. Throttling the shell slows the bundle and moves the shift into a window that has nothing to do with the defect:

```js
let release;
const gate = new Promise(resolve => { release = resolve; });
let markIntercepted;
const intercepted = new Promise(resolve => { markIntercepted = resolve; });
const pattern = '**/api/invoices*';
const delayInvoices = async (route) => {
  markIntercepted();
  await gate;
  await route.continue();
};
await page.route(pattern, delayInvoices, { times: 1 });
let before, after, shifts;
try {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await intercepted; // Bound this with the runner timeout; a missed route is unknown.
  await page.waitForSelector('[data-testid=invoice-skeleton]');
  before = await page.locator('#invoice-list').boundingBox();
  release();
  await page.waitForSelector('[data-testid=invoice-row]');
  await page.evaluate(() => new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))));
  after = await page.locator('#invoice-list').boundingBox();
  shifts = await page.evaluate(() => window.__shifts);
} finally {
  release();
  await page.unroute(pattern, delayInvoices);
}
```

Where the app has no test ids, wait on the loaded content's own selector and take the before snapshot immediately after `goto` resolves.

Run against a production build. In dev the bundler compiles the route on first navigation, and the resulting paint sequence is an artefact of the dev server.

## Reading the result

| Observation | Result |
|---|---|
| Container height changes on data arrival AND a `layout-shift` entry names it | `reproduced`, fail. Report both heights, the delta in px, and the sum of captured shift values (not the session-window CLS metric) |
| Heights differ but no shift entry names the container | Inconclusive from attribution alone; inspect displaced siblings and the capture before deciding |
| Shift entries exist but all name elements below the fold that nobody had scrolled to | Record the observation and viewport; tiering belongs to ui-design, not this probe |
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
