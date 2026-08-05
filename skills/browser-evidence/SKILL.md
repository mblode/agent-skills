---
name: browser-evidence
description: >-
  Starts the app in the current checkout on its own derived port, drives a
  throwaway headless browser over the changed surfaces, writes screenshots,
  console errors, and a report into `.captain/browser/` for a verifier to cite,
  then stops everything it started. Built for unattended worktree agents: no
  human gate, no shared browser, no leftover process, no third-party service.
  Exits cleanly with a not-applicable note when the repo has no runnable app,
  no dev server, or no browser surface in the diff. Use when a fleet or
  worktree agent needs proof that a UI change actually renders before writing
  its verdict, or when asked to "check this in a browser", "screenshot the
  running app", "prove the UI renders", or "capture browser evidence". For
  auditing React and Next.js source without running it use `ui-audit`; for
  building or restyling the UI use `ui-design`.
---

# browser-evidence

- **IS:** start the app, look at it, capture evidence, stop. One throwaway headless browser per invocation, one derived port per checkout, one evidence folder a verifier can cite per criterion.
- **IS NOT:** a browser-automation framework, an e2e test suite, an interactive session in the user's real Chrome, a reason to add a dependency to the repo under test, or a pass/fail gate. It produces evidence; the verifier judges it.

Opt-in only. Most tickets are copy, label, and refactor diffs with no browser surface, so this is never a default pipeline step. In captain it belongs in `.skills` or `CAPTAIN_SKILLS` for the repos that want it, never in `DEFAULT_SKILLS`.

## Contents

- Workflow checklist
- Phase 1: Decide whether there is anything to look at
- Phase 2: Pick ports and start the app
- Phase 3: Capture with a throwaway browser
- Phase 4: Write the evidence
- Phase 5: Tear down and verify teardown
- Hard rules
- Gotchas
- Related skills

## Workflow checklist

Copy this to track progress:

```text
Browser evidence progress:
- [ ] Phase 1: Surface check, dev-server check, bail out cleanly if either is absent
- [ ] Phase 2: Derive app and CDP ports from the checkout path, start the server, poll until ready
- [ ] Phase 3: Playwright if already installed, else headless Chrome over CDP
- [ ] Phase 4: Write .captain/browser/report.md plus screenshots and console output
- [ ] Phase 5: Kill the server and the browser, delete the temp profile, confirm both ports are free
```

## Phase 1: Decide whether there is anything to look at

Three questions, in order. Any "no" ends the run at Phase 4 with `status: not-applicable` and a one-line reason. That is a clean exit, not a failure.

1. **Does the diff touch a browser surface?** `git diff --name-only` (plus `--staged`) against page, route, layout, component, template, style, or asset paths. A diff of only server code, config, docs, tests, or build files has nothing to render.
2. **Is there a runnable app?** A `dev` or `start` script in the nearest `package.json`, or the repo's documented run command in `CLAUDE.md`/`AGENTS.md`/`README.md`. A library, CLI, or worker has no browser surface by construction.
3. **Which URLs?** Map each changed route file to its path using the framework's own convention (`app/settings/page.tsx` is `/settings`). Cap at three surfaces: the changed routes, or `/` when the change is in a shared component and no route maps cleanly. Say in the report which URLs you chose and why.

Read `CLAUDE.md`/`AGENTS.md` for the repo's real run command before assuming `npm run dev`. Monorepos usually need a workspace filter, and getting this wrong starts the wrong app.

## Phase 2: Pick ports and start the app

Ports are derived from the absolute checkout path, so N worktrees of the same repo never collide and the same worktree gets the same port every run:

```bash
sum=$(printf '%s' "$PWD" | cksum | cut -d' ' -f1)
APP_PORT=$(( 20000 + sum % 20000 ))
CDP_PORT=$(( 40000 + sum % 20000 ))
free() { ! lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
while ! free "$APP_PORT"; do APP_PORT=$((APP_PORT + 1)); done
while ! free "$CDP_PORT"; do CDP_PORT=$((CDP_PORT + 1)); done
```

Hash for separation, linear probe for the collision the hash cannot rule out. Never a fixed port: 3000 is whatever the human is already running, and 9222 is their debugging Chrome.

Run the whole start, capture, and stop sequence inside **one** bash invocation with `set -euo pipefail` and a `trap cleanup EXIT`. A failure between start and stop then still reaps the server, which a sequence of separate tool calls cannot promise.

```bash
mkdir -p .captain/browser
PORT=$APP_PORT npm run dev -- --port "$APP_PORT" >.captain/browser/server.log 2>&1 &
SERVER_PID=$!
URL="http://127.0.0.1:$APP_PORT"
for _ in $(seq 90); do
  kill -0 "$SERVER_PID" 2>/dev/null || break
  curl -sf -o /dev/null "$URL" && break
  sleep 1
done
```

Pass the port both ways (`PORT=` and the flag) because frameworks disagree on which they read. Then confirm it: if `server.log` says the port was taken and it moved to another one, stop and record that, because a screenshot of a neighbouring worktree's app is worse than no screenshot. If the server dies or never answers within the budget, go to Phase 4 with `status: blocked` and the last 20 lines of `server.log`. A dev server that exists and crashes is a finding, not a bail-out.

Prefer the dev server. Only run a production build when the change cannot show up without one, and say so in the report; it multiplies the run time.

## Phase 3: Capture with a throwaway browser

Never add a dependency to the repo under test. Two paths, in order.

**Playwright, only when it is already a devDependency.** Write this to `.captain/browser/capture.mjs`. The script must live inside the repo tree, because node resolves `playwright` from the script's own location, not the working directory:

```js
setTimeout(() => process.exit(3), 60_000).unref(); // hard stop, this must never hang
import { chromium } from "playwright";
const [url, out] = process.argv.slice(2);
const launch = async () => {
  try {
    return await chromium.launch({ headless: true });
  } catch {
    return await chromium.launch({ headless: true, channel: "chrome" }); // browsers not downloaded
  }
};
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  const res = await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  await page.screenshot({ path: out, fullPage: true });
  console.log(JSON.stringify({ status: res?.status() ?? null, errors }, null, 2));
} finally {
  await browser.close();
}
```

A devDependency does not mean a usable browser: Playwright's binaries are version-pinned and often missing after an upgrade. `channel: "chrome"` reuses the system Chrome, still in Playwright's own throwaway profile. If both launches fail, drop to the CDP path below. Never run `playwright install`.

**Otherwise headless Chrome plus a short CDP script.** Node 22 has `fetch` and `WebSocket` as globals, so this needs nothing installed:

```bash
PROFILE=$(mktemp -d)
"$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check \
  --window-size=1280,800 --user-data-dir="$PROFILE" \
  --remote-debugging-port="$CDP_PORT" about:blank \
  >.captain/browser/chrome.log 2>&1 &
CHROME_PID=$!
for _ in $(seq 20); do curl -sf -o /dev/null "http://127.0.0.1:$CDP_PORT/json/version" && break; sleep 0.5; done
```

`$CHROME` is the first of `google-chrome`, `google-chrome-stable`, `chromium`, or `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` that exists. The fresh `--user-data-dir` is the whole isolation story: it is what keeps this off the user's profile, cookies, extensions, and open tabs. Never omit it.

```js
setTimeout(() => process.exit(3), 60_000).unref(); // hard stop, this must never hang
import { writeFile } from "node:fs/promises";
const [url, port, out] = process.argv.slice(2);
// Open a blank target and navigate; creating it on the URL loads the page twice and doubles every console entry.
const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
const pending = new Map();
const errors = [];
let id = 0;
const send = (method, params = {}) =>
  new Promise((resolve) => {
    pending.set(++id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id) return pending.get(m.id)?.(m.result);
  // console-api entries also arrive on Runtime, so take them there only.
  if (m.method === "Log.entryAdded" && m.params.entry.level === "error" && m.params.entry.source !== "console-api")
    errors.push(m.params.entry.text);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
    errors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
  if (m.method === "Runtime.exceptionThrown")
    errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
});
await send("Log.enable");
await send("Runtime.enable");
await send("Page.enable");
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 4000));
const { data } = await send("Page.captureScreenshot", { captureBeyondViewport: true });
await writeFile(out, Buffer.from(data, "base64"));
await fetch(`http://127.0.0.1:${port}/json/close/${t.id}`);
console.log(JSON.stringify({ errors }, null, 2));
ws.close();
```

One invocation per URL. Every wait is bounded: the `setTimeout` above is the outer guard, since `timeout(1)` is not installed on macOS and a capture that hangs is a stuck fleet agent, which looks exactly like a slow one until a human goes looking.

If the surface redirects to a login wall, stop there and record it. Do not authenticate, do not reuse the user's session, do not put credentials in a script.

## Phase 4: Write the evidence

Everything lands in `.captain/browser/` inside the checkout, next to the rubric and verdict the verifier already reads. Captain excludes `.captain/` from git, so none of it reaches the diff.

```text
.captain/browser/
  report.md        the thing a criterion cites
  <surface>.png    one screenshot per captured surface
  console.json     console errors and page errors per surface
  server.log       dev-server output, the evidence when nothing started
```

`report.md` opens with one status line, then a row per surface:

```markdown
status: captured        # captured | not-applicable | blocked
tool: playwright        # playwright | chrome-cdp
port: 27431

| Surface | URL | Screenshot | HTTP | Console errors |
| --- | --- | --- | --- | --- |
| /settings | http://127.0.0.1:27431/settings | settings.png | 200 | 0 |
```

Then a short "What I looked at and what I saw" paragraph naming the change and whether it is visible in the screenshot. A screenshot nobody read is not evidence.

For `not-applicable` and `blocked`, the report is one status line plus the reason, and that is a complete, successful run.

**How a verifier uses it.** Cite the file in the criterion's `evidence` field, for example `.captain/browser/report.md: /settings renders the new empty state, 0 console errors`. A `not-applicable` report is neither a pass nor a failure: mark a UI criterion `na: true` with the reason from the report. A `blocked` report is a real finding and belongs in the criterion's evidence as a failure to start the app, not as a silent pass.

## Phase 5: Tear down and verify teardown

`cleanup` runs from the `trap`, so it must be safe to run twice and must never itself fail the script:

```bash
cleanup() {
  [ -n "${CHROME_PID:-}" ] && kill "$CHROME_PID" 2>/dev/null
  [ -n "${SERVER_PID:-}" ] && kill -- -"$SERVER_PID" 2>/dev/null || kill "$SERVER_PID" 2>/dev/null
  [ -n "${PROFILE:-}" ] && rm -rf "$PROFILE"
  return 0
}
```

Then prove it: `free "$APP_PORT" && free "$CDP_PORT"` after the script exits. If either is still held, kill the listener by pid before finishing. Whatever this skill started, it stops in the same run. Nothing survives to the next ticket.

## Hard rules

1. **Throwaway and per-invocation.** A fresh `--user-data-dir` every run, deleted at the end. Never attach to a running Chrome (no `connectOverCDP`, no `launchPersistentContext` on a real profile), never use the user's profile, never a remote or cloud browser.
2. **No daemon.** Nothing is left listening. No pidfile, no reuse of a previous run's server, no "leave it warm for next time".
3. **No third-party service, ever.** No hosted browser, no screenshot uploader, no analytics or telemetry, no sending page content anywhere. Everything stays on `127.0.0.1` and in `.captain/browser/`.
4. **No human gate.** Never wait for confirmation, never open a headed browser, never `page.pause()`, never `PWDEBUG`. Every wait has a bounded timeout.
5. **No new dependency.** Playwright only when the repo already has it. Never run `playwright install`, never `npm install` anything.
6. **Degrade, never fail.** No surface, no app, or no browser binary means `status: not-applicable` and exit 0.

## Gotchas

- The dev server silently picking a different port when yours is taken, so you screenshot a neighbouring worktree's app. Pass the port explicitly and confirm it in `server.log` before navigating.
- Sleeping a fixed number of seconds instead of polling: a cold Next.js or Vite first compile can take a minute, and the screenshot lands on a blank page or a compile overlay.
- Omitting `--user-data-dir`: Chrome then reuses the user's real profile and may hand you an existing instance, which breaks the isolation rule and the headless flag at the same time.
- Treating a `playwright` entry in `package.json` as proof a browser exists. Its binaries are version-pinned, so a version bump leaves a devDependency whose `launch()` throws "Executable doesn't exist". Catch it and fall back; do not download.
- Trusting the CDP defaults: a target created directly on the URL loads the page twice, and `console.error` arrives on both `Log.entryAdded` and `Runtime.consoleAPICalled`. Either mistake doubles the error count in the report and sends the verifier hunting a problem that is not there.
- Killing only the parent: `npm run dev` spawns children, so the port stays held. Kill the process group, then check the port is free.
- Running the browser step at all on a copy, label, or config diff. Phase 1 exists to skip fast; a browser pass on a diff with no surface is pure cost.
- Reporting a screenshot as proof without saying what is in it. The verifier reads the report, not the pixels.

## Related skills

- `ui-audit`: audits React and Next.js frontends from source, no browser. Use it for the defect hunt; use this skill for the "does it actually render" evidence that source review cannot produce.
- `ui-design`: builds or restyles the UI this skill then looks at.
- `pr-reviewer`: read-only diff review. It reasons about the code; a report from here is the runtime half of the same story.
- The external `visual-qa` skill, where installed, drives the user's real Chrome for a human reviewing changes interactively. That is the attended counterpart and the opposite trade: it is not safe for an unattended fleet agent.
