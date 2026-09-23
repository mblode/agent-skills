# Probe: console and network

Collects everything the browser already told the developer and nobody read. Cheap enough to run on every route in the session, and it regularly produces the most serious finding of a run.

## What it measures

Console errors and warnings, uncaught page errors, failed requests, and responses at 400 and above, each tied to the route that produced it.

## Recipe

Attach the listeners before the first navigation:

```js
const log = { console: [], pageErrors: [], failed: [], badStatus: [] };
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning')
    log.console.push({ type: m.type(), text: m.text(), at: m.location() });
});
page.on('pageerror', (e) => log.pageErrors.push({ message: e.message, stack: e.stack }));
page.on('requestfailed', (r) =>
  log.failed.push({ url: r.url(), method: r.method(), reason: r.failure()?.errorText }));
page.on('response', (r) => {
  if (r.status() >= 400) log.badStatus.push({ url: r.url(), status: r.status() });
});
```

Exercise the route before reading the log: navigate, wait for the primary content, scroll to the bottom to trigger lazy work, and click the primary action if it is non-destructive. Errors thrown on interaction outnumber errors thrown on load.

## Signatures worth naming

| Signature | What it means |
|---|---|
| `Hydration failed`, `Text content does not match server-rendered HTML` | SSR and client render diverged. On the primary route this is a ship blocker in `ui-design`'s tiering, and it is one of the few defects with no static tell |
| `Each child in a list should have a unique "key"` | Reconciliation will reuse the wrong nodes; commonly the cause of a form losing input on re-render |
| `Cannot update a component while rendering a different component` | A render-phase state update, usually a loop about to happen under load |
| `Warning: validateDOMNesting` | Invalid markup the browser silently restructured; the DOM the code assumes is not the DOM that exists |
| `Refused to load ... Content Security Policy` | A resource silently dropped in production and not in dev |
| 404 on a font, image, or chunk | Visible as a fallback font or a broken image, and invisible in source |
| `ResizeObserver loop completed with undelivered notifications` | Noise in most apps. Note it and move on |

## Reading the result

Emit under `runtime:<signature>` where no ui-design rule owns the class, because these are browser findings and the corpus should not be made to look as though it predicted them. Two exceptions map cleanly:

| Observation | Rule id |
|---|---|
| A failed request whose failure renders no user-visible state | `states-no-error-state`, confirmed by `probes/failure-injection.md` |
| A 404 on an image referenced by the page | `a11y-image-alt-text` only if the alt text is also missing; otherwise a runtime finding |

Report the route, the count, and the first occurrence with its location. A repeated warning firing on every row of a list is one finding with a count.

## False positives to guard

- **Dev-only warnings.** React logs `key` warnings, `act` warnings, and double-invoked effects under StrictMode in development and not in production. Run this probe in both modes when it matters, and label which build produced each entry.
- **Extension and devtools noise.** A clean context with no extensions avoids most of it. Anything sourced from a `chrome-extension://` URL is not the app's.
- **Analytics and consent scripts** blocked by the environment produce failed requests that are correct in a sandbox. Filter by origin and say which origins were filtered.
- **The probe's own interceptions.** Requests aborted by another probe's `page.route` show up as failures. Run this probe on an uninjected pass.
- **`favicon.ico` 404s.** Real, trivial, and never worth a finding on its own.

## Evidence to write

`console-<route>.json` with all four arrays intact, including the entries judged noise. The filtered-out list is what lets a reader disagree with the filter.
