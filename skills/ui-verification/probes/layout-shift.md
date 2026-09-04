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
await page.route('**/api/invoices*', async (route) => {
  await new Promise((r) => (release = r));
  await route.continue();
});
await page.goto(url);
await page.waitForSelector('[data-testid=invoice-skeleton]');
const before = await page.locator('#invoice-list').boundingBox();
release();
await page.waitForSelector('[data-testid=invoice-row]');
const after = await page.locator('#invoice-list').boundingBox();
const shifts = await page.evaluate(() => window.__shifts);
```

Where the app has no test ids, wait on the loaded content's own selector and take the before snapshot immediately after `goto` resolves.

Run against a production build. In dev the bundler compiles the route on first navigation, and the resulting paint sequence is an artefact of the dev server.

## Reading the result

| Observation | Result |
|---|---|
| Container height changes on data arrival AND a `layout-shift` entry names it | `reproduced`, fail. Report both heights, the delta in px, and the summed CLS |
| Heights differ but no shift entry names the container | It moved inside its own reserved space. `not-reproduced` |
| Shift entries exist but all name elements below the fold that nobody had scrolled to | Report at lower severity and say the shift was off-screen |
| Total CLS under 0.1 with no container-level movement | `not-reproduced` |

The same probe covers `perf-image-dimensions-and-priority`: an `<img>` with no intrinsic dimensions shows up as a shift source naming the image, with `from` height 0.

## False positives to guard

- **Shifts with `hadRecentInput`** are the user's own doing (an accordion they opened) and are excluded by the observer, which is why the filter is in the recipe and not optional.
- **`content-visibility: auto` subtrees** legitimately shift within themselves as they come into view.
- **Font swap** produces a real shift that the loading state did not cause. Attribute it: the source node will be a text container, not the placeholder, and the fix belongs to font loading rather than the skeleton.
- **The harness itself.** A devtools overlay, an injected banner, or a screenshot-time scroll all generate entries. Compare the entry timestamps against the injected delay window and drop anything outside it.
- **A run with no loading state observed at all** means the delay never applied or the data was cached. Assert the skeleton was seen; if it was not, the result is `unknown`, not a pass.

## Evidence to write

`shifts.json` with the entries and their sources, the before and after `boundingBox` per container, and two captures: one with the loading state up, one immediately after resolution. The pair is what makes the finding obvious to a reader who will not read the numbers.
