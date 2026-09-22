# Probe: failure injection

Intercepts the route's data request and returns each failure the happy path never sees. This is the highest-yield probe in the set, because "happy path only" is the most common production UX bug and the one a source read is least able to settle: an error branch that exists in the code says nothing about what renders when it runs.

## What it measures

Four injected conditions, each with its own assertions:

| Injection | Asks |
|---|---|
| `500` with a JSON error body | Is there an error state, is its copy usable, does the retry control actually refetch |
| `200` with `[]` or a zero-count payload | Is there an empty state, and does it offer a way out |
| `200` with a malformed body | Does the parse failure surface, or does the route go blank |
| `abort` / offline | Does an offline failure read differently from a server failure |

## Running it

```bash
node <skill>/scripts/verify/probe.mjs failure-injection --url <url> --route '**/api/invoices*' --inject 500|empty|malformed|abort
```

## What the script does

Fulfils the `--route` request with the chosen condition (the 500 body plants a driver token and an internal IP so the leak check has something to find), records alerts, body text, and action labels, flags leak and vague-copy signatures, then removes the interception, clicks the retry control, and records whether a new request went out. Zero matched requests returns `unknown`.

Match on the specific path, never a host substring: once analytics and telemetry share an origin, a broad pattern intercepts requests the probe did not mean to break, and the failure it then reports belongs to the harness.

Assert the interception fired at all. A route pattern that never matched injects nothing, the page renders its happy path, and the probe reports a passing error state that was never tested. Count the matched requests and treat zero as `unknown`.

## The retry assertion

A retry button wired to nothing is identical in source to one that works, and the script's retry click is the only way to tell them apart. A retry that reloads the whole document rather than refetching is a pass with a note, not a fail.

## Reading the result

| Observation | Rule id |
|---|---|
| `blank: true`, or the route's shell disappeared | `states-no-error-state`; if a parent boundary should have caught it, `async-no-error-boundary` |
| No `role=alert` and no error copy in `bodyText` | `states-no-error-state` |
| Copy matches the leak signature below | `microcopy-leaked-error-message` |
| Copy matches the vague set below | `microcopy-vague-error` |
| Retry control absent, or present and issuing no request | `states-no-error-state` |
| Empty payload renders a zero-row table or a bare "No data" with no action | `states-no-empty-state` |
| Offline and server failure render identical copy | `microcopy-vague-error`, low severity |

Leak signature: a stack frame (`at fn (file:12:5)`), a typed error name (`TypeError:`, `PrismaClientKnownRequestError`), a driver or dialect token (`ECONNREFUSED`, `SQLSTATE`, `PG::`), a hostname, or an internal IP. The recipe above plants one deliberately, so a probe that does not flag it has an assertion bug.

Vague set: `Something went wrong`, `An error occurred`, `Error`, `Invalid`, `Failed`, `Oops`, `Unknown error`, alone and with no cause or next step.

## Mutation failures

Point the same interception at the write request rather than the read, and three more rules fall out of one run. Not scripted, because it needs the form filled: in a Playwright session, fill the form, submit, and hold the response:

- While it is held, the submit control must be disabled and a second click must issue no second request (`forms-no-disable-while-submitting`). A pending state that never appears is the `useFormStatus` bug (`forms-use-form-status-misuse`).
- Release it as a 422 with field errors: every field the user typed must still hold its value (`forms-lost-data-on-error`), the errors must be associated with their fields rather than floating in a toast (`forms-error-association`), and focus must move to the first invalid one (`forms-inline-errors-first-focus`).
- Release it as a 500 after an optimistic update: the optimistic row must disappear and the previous state must return (`async-optimistic-without-rollback`). An optimistic row that survives a rejected write is a user believing something happened that did not.

## Out-of-order responses

The same interception mechanism reproduces `async-out-of-order-responses`, which no other technique reaches, but it is not scripted because the trigger is the app's own input: in a Playwright session, route the search request so the first response waits about 1500ms and the second 50ms, type two characters with a short delay, and assert the rendered list matches the second query. Stale results winning is `reproduced`. An AbortController or a `useDeferredValue` guard shows up as the first response never rendering.

## False positives to guard

- **A retry that fires on a timer** issues its request without a click. Watch for a request between the error render and the click, and attribute the pass correctly.
- **A global error toast from a previous probe** persists across navigations in some apps. Start each injection from a fresh context.
- **Service workers and caches** serve the happy path straight past the interception. Clear storage between injections, and disable the service worker in the context.
- **Copy assembled from an i18n bundle** that failed to load reads as a missing error state when the real defect is a missing translation. Check the bundle request succeeded.

## Evidence to write

One capture per injection, `injection-<condition>.json` holding the rendered text, the alerts, the action labels, and the retry request result. The 500 and the empty capture side by side are usually the whole argument.
