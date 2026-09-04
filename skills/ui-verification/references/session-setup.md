# Session Setup

Everything that has to be true before the first probe runs. A probe result is only as good as the session under it, and every failure mode here produces a confident wrong answer rather than an error.

## Table of contents

- [Driver](#driver)
- [Build mode](#build-mode)
- [Booting the app](#booting-the-app)
- [Auth and seeded data](#auth-and-seeded-data)
- [Resolving routes from a diff](#resolving-routes-from-a-diff)
- [Determinism](#determinism)
- [When to stop](#when-to-stop)

## Driver

Use the supported browser surface exposed by the host. The recipes below use Playwright syntax as an adapter; do not assume `evaluate`, interception, or browser launch is available on another driver.

**Playwright** is the default. It gives request interception, network and CPU emulation, a fresh isolated context per run, and repeatability. Use the repo's own `@playwright/test` install when there is one, so the browser version matches CI. Where a browser binary is already provisioned in the environment, point Playwright at it with `executablePath` rather than downloading another.

**A browser driven over the Chrome DevTools tool family** is the fallback: use it when the app cannot be automated headlessly, when the probe needs a real logged-in profile, or when installing anything in the repo is off the table.

The tradeoff decides which probes exist:

| Probe | Needs interception or network control |
|---|---|
| failure-injection | Yes. Does not exist without it |
| layout-shift | Yes, to hold the data response |
| web-vitals | Yes, for CPU and network throttling |
| theme-locale-matrix | Only for the pseudo-locale bundle transform |
| axe-scan, target-size, focus-walk, viewport-stress, console-network | No |

Under a driver without interception, report those probes as skipped with the reason, never as passed. Silently dropping half the battery is the failure this table exists to prevent.

## Build mode

| Probe | Build |
|---|---|
| web-vitals, layout-shift | Production build, served from the production server |
| Everything else | Dev is fine, and faster to iterate |

A dev server compiles the route on first navigation. That compilation lands in LCP and can generate paint sequences that exist nowhere in production, so a dev-mode perf number measures the bundler. Development also enables React's extra warnings, which is useful for the console probe and misleading for everything else: label which build produced each result.

## Booting the app

Read the manifest's scripts rather than guessing the command. Prefer, in order, an explicit instruction from the user, a documented command in the repo's own agent instructions, then the conventional script (`dev`, `start`, `preview`).

Wait for readiness by polling the URL until it answers, never by sleeping. A fixed sleep is either too short, which produces a run against a half-started server, or too long, which is why nobody runs the suite twice.

Use a free port and record the process started by this run. Reuse an existing server only after confirming its checkout and build. Stop only a server this run owns; never kill an unrelated listener to claim port 3000.

## Auth and seeded data

Reuse a session rather than driving a login form: a saved storage state, a test-account cookie the repo already provisions, or the app's own dev-login route. Never type real credentials, and never read them out of the environment into a probe script.

A route that needs auth with no session available returns `unknown` with reason `auth-required`. This is the single most important `unknown` in the skill: an unauthenticated app usually redirects to a login page that renders perfectly, and every probe then passes against the wrong page. Assert the final URL is the route requested before believing any result from it.

Data matters as much as auth. An account with no records makes every list render its empty state, so `states-no-empty-state` passes and `states-layout-shift` cannot fire. Note the account's data shape in the session block, and prefer a seeded fixture over whatever the developer's local database happens to hold.

## Resolving routes from a diff

Map changed files to URLs before anything else, because a probe run against the wrong route is worse than no run:

1. **A route file is its own URL.** Next.js `app/<segment>/page.tsx` maps to `/<segment>`; `pages/<name>.tsx` likewise. Dynamic segments need a real value: take one from the seeded data, never a placeholder that 404s.
2. **A component file needs its importers.** Walk imports upward until a route file is reached. A component reachable from three routes gets probed on the one the diff touched, or on the most critical of them when the diff is the component itself.
3. **A component with no reachable route** falls back to the repo's Storybook or component workshop if one exists, and to `unknown` with reason `no-route` if not. A component mounted in isolation is a real target for target-size, focus-walk and axe-scan, and a poor one for layout-shift and failure-injection, which need the app's real data layer.
4. **A shared layout or token file** changes every route. Probe the two or three highest-traffic routes rather than all of them, and say which were chosen.

Confirm each resolved URL returns 200 and renders the changed component before probing it. A route that resolved but renders a different branch produces findings about code nobody changed.

## Determinism

A probe that flips between runs is worse than no probe: it spends the credibility that measurement was supposed to buy.

- **Fix the viewport and the device scale.** Never let the probe inherit whatever the window happened to be.
- **Disable animation for captures** with reduced motion, and run motion-sensitive checks in a separate pass with it on. Reduced motion is also a code path, and it can be broken.
- **Freeze the data.** The same seeded fixture on every run, so a list length change does not read as a layout regression.
- **Fresh context per probe.** Storage, service workers, and caches carried between probes are how one probe's injection leaks into the next one's result.
- **Repeat uncertain results** when timing or inconsistent evidence warrants it. A deterministic captured failure needs no ritual second run. Record inconsistent results and their conditions as inconclusive.

## When to stop

Stop and report the session, not a finding list, when the app will not boot, the resolved route 404s, auth cannot be established, or the driver lacks what the selected probes need. Each of those is a reportable outcome. None of them is a clean run, and a report that presents an empty finding list without the session block is indistinguishable from a passing verification.
