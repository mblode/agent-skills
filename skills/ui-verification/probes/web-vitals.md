# Probe: web vitals

Measures LCP, CLS and INP in the lab, with attribution. The value here is naming the element, not scoring the page: `ui-design`'s defer table sends budgets to Lighthouse and field data to RUM, and this probe does not take that over.

Read that boundary literally. A single headless run on a developer machine is not a performance verdict, and reporting it as one is how a team learns to distrust the whole report.

## What it measures

| Metric | What the probe adds |
|---|---|
| LCP | Which element is the largest contentful paint, and which of its four phases dominates |
| CLS | The same entries as `probes/layout-shift.md`, summed over the page load rather than one data window |
| INP | The response time of a specific scripted interaction, not a page score |

## Recipe

Inject the attribution build before navigation so the observers register early:

```js
await page.addInitScript({ path: require.resolve('web-vitals/dist/web-vitals.attribution.iife.js') });
await page.addInitScript(() => {
  window.__vitals = [];
  addEventListener('load', () => {
    const push = (m) => window.__vitals.push({
      name: m.name, value: m.value, rating: m.rating, attribution: m.attribution });
    webVitals.onLCP(push); webVitals.onCLS(push); webVitals.onINP(push);
  });
});
```

Then drive a real interaction so INP has something to measure. INP with no interaction reports nothing, which reads as a pass:

```js
await page.getByRole('button', { name: /save|search|submit/i }).click();
await page.waitForTimeout(500);
const vitals = await page.evaluate(() => (window.__vitals ??= []));
```

Run against a production build, on a fresh context with no cache, and with CPU throttled (CDP `Emulation.setCPUThrottlingRate`, 4x) so a fast machine does not hide a slow interaction. Report the throttling factor with every number; without it the numbers mean nothing across machines.

## Reading the result

Report attribution, and flag only what attribution makes actionable:

| Observation | Rule id |
|---|---|
| LCP element is an image with no `priority` or `fetchpriority` and a late `resourceLoadDelay` | `perf-image-dimensions-and-priority`, `reproduced` |
| LCP element is below the fold, or is a spinner | The route's largest paint is not its content; report as a runtime finding with the element |
| CLS above 0.1 with sources naming a placeholder | Defer to `probes/layout-shift.md`, which has the before and after boxes |
| LCP dominated by `resourceLoadDelay` on a data request, with the whole route blank until it resolves | `async-no-suspense-boundary`, confirming: nothing streamed, so the slowest fetch gated the first paint |
| INP above 200ms with `attribution.longAnimationFrames` naming a script | Runtime finding naming the script. No rule owns it, and none should |

Everything else goes in the report as measured context, not as a finding. A LCP of 2.8s on one throttled headless run is a number, not a defect.

## False positives to guard

- **Dev builds.** On-demand compilation on first navigation lands squarely in LCP. A dev-mode LCP measures the bundler.
- **A cold cache on every run** overstates repeat-visit performance and understates nothing, so it is the right default, but say which it was.
- **The first run after a build** pays for cold server-side caches too. Discard the first navigation and measure the second.
- **INP with no interaction, or with an interaction that opens a new page,** reports nothing or the wrong thing. Assert an interaction was recorded.
- **Headless font substitution** changes text paint timing. It moves LCP by a small amount and is not worth correcting for, but it is worth knowing when a number sits on a threshold.

## Evidence to write

`vitals.json` with the raw metric objects including attribution, the throttling settings, the build mode, and which navigation was measured. Attribution is the whole payload; a JSON file holding three numbers and no attribution is not worth writing.
