#!/usr/bin/env node
// Runs one browser probe against a running app and writes its evidence to disk.
//
//   node <skill>/scripts/verify/probe.mjs <probe> --url <url> [options]
//
// Probes: axe-scan, target-size, focus-walk, viewport-stress, console-network,
//         failure-injection, layout-shift, web-vitals, theme-capture
//
// Run it from the application's repository: Playwright, @axe-core/playwright
// (or axe-core), and web-vitals resolve from the current working directory, so
// the browser version matches the repo's own tests. Nothing is installed.
//
// The script measures and records; it never decides a tier or a ship verdict.
// It prints one JSON object on stdout: the conditions, the raw measurement,
// mechanical candidates, evidence paths (already written), and `unknown` with a
// reason whenever the probe could not decide. Reading the result against the
// rule is the agent's job, per references/verify/probes/<probe>.md.
//
// Options
//   --url <url>                 route to probe (required)
//   --out <dir>                 artifact root (default .ui-verification/<run-id>)
//   --run-id <id>               default: UTC timestamp, so a re-run never overwrites
//   --width <px> --height <px>  viewport (default 1280x800; target-size 360x800)
//   --touch                     touch emulation (hasTouch + isMobile)
//   --theme light|dark          emulated colour scheme, and the theme asserted
//   --theme-storage key=value   localStorage entry set before the first navigation
//   --theme-click <selector>    click the app's own theme toggle after load
//   --theme-media-only          the app themes purely by prefers-color-scheme
//   --storage-state <file>      saved Playwright auth state
//   --wait-for <selector>       primary content selector to wait for
//   --executable-path <path>    browser binary already provisioned
//   --route <glob>              data request pattern (failure-injection, layout-shift)
//   --inject 500|empty|malformed|abort   failure-injection condition (default 500)
//   --retry-name <regex>        retry control name (default: try again|retry|reload)
//   --loading-selector <sel>    placeholder that must be seen (layout-shift)
//   --loaded-selector <sel>     content that marks arrival (layout-shift)
//   --container-selector <sel>  box measured before and after (layout-shift)
//   --dir rtl                   set the document direction after load (RTL geometry pass)
//   --expand                    pseudo-locale in the DOM: accent and pad text to ~140%
//   --dialog-trigger <sel>      opens a dialog for the focus-walk dialog cycle
//   --interact <role>:<regex>   interaction driven for INP (web-vitals), e.g. button:save
//   --cpu <n>                   CPU throttle factor for web-vitals (default 4)
//   --timeout <ms>              per-wait timeout (default 15000)

import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const PROBES = ['axe-scan', 'target-size', 'focus-walk', 'viewport-stress', 'console-network',
  'failure-injection', 'layout-shift', 'web-vitals', 'theme-capture'];

function parseArgs(argv) {
  const [probe, ...rest] = argv;
  const opts = {};
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    if (!key.startsWith('--')) throw new Error(`unexpected argument: ${key}`);
    const name = key.slice(2);
    const flag = ['touch', 'theme-media-only', 'expand'].includes(name);
    opts[name] = flag ? true : rest[++i];
    if (!flag && opts[name] === undefined) throw new Error(`${key} needs a value`);
  }
  return { probe, opts };
}

const repoRequire = createRequire(join(process.cwd(), 'package.json'));
async function importFromRepo(names) {
  for (const name of names) {
    try { return await import(pathToFileURL(repoRequire.resolve(name)).href); } catch { /* try next */ }
  }
  return null;
}
function resolveFromRepo(name) {
  try { return repoRequire.resolve(name); } catch { return null; }
}

function slug(url) {
  const path = new URL(url).pathname.replace(/\/+$/, '') || '/';
  return path === '/' ? 'root' : path.slice(1).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function emit(result) {
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

async function main() {
  const { probe, opts } = parseArgs(process.argv.slice(2));
  if (!PROBES.includes(probe)) throw new Error(`probe must be one of: ${PROBES.join(', ')}`);
  if (!opts.url) throw new Error('--url is required');

  const touchDefault = probe === 'target-size';
  const viewport = {
    width: Number(opts.width ?? (touchDefault ? 360 : 1280)),
    height: Number(opts.height ?? 800),
    touch: Boolean(opts.touch ?? touchDefault),
  };
  const theme = opts.theme ?? 'light';
  const timeout = Number(opts.timeout ?? 15000);
  const runId = opts['run-id'] ?? new Date().toISOString().replace(/[:.]/g, '').slice(0, 15) + 'Z';
  const route = new URL(opts.url).pathname;
  const dir = resolve(opts.out ?? join('.ui-verification', runId), slug(opts.url), probe);
  mkdirSync(dir, { recursive: true });
  const stem = `${viewport.width}-${theme}`;
  const evidence = [];
  const write = (name, data) => {
    const p = join(dir, name);
    writeFileSync(p, typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 2));
    evidence.push(p);
    return p;
  };
  // Screenshot target: recorded as evidence, written by Playwright.
  const shotPath = (name) => { const p = join(dir, name); evidence.push(p); return p; };
  const base = { probe, route, viewport, theme, runId, evidence };

  const pw = await importFromRepo(['playwright', '@playwright/test', 'playwright-core']);
  if (!pw) return emit({ ...base, result: 'unknown', reason: 'driver-unavailable',
    note: 'No Playwright install resolves from this repository. Use the host browser tools and follow the probe reference by hand.' });
  const { chromium } = pw.default ?? pw;

  const browser = await chromium.launch({ headless: true, executablePath: opts['executable-path'] });
  try {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.touch, isMobile: viewport.touch,
      colorScheme: theme === 'dark' ? 'dark' : 'light',
      // Captures are judged still; motion-sensitive checks run in their own pass.
      reducedMotion: 'reduce',
      storageState: opts['storage-state'],
      serviceWorkers: 'block',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(timeout);
    if (opts['theme-storage']) {
      const [k, v] = opts['theme-storage'].split('=');
      await page.addInitScript(([key, value]) => { try { localStorage.setItem(key, value); } catch {} }, [k, v]);
    }

    const ctx = { page, context, opts, viewport, theme, timeout, write, shotPath, stem, dir };
    const run = RUNNERS[probe];
    const out = await run(ctx);

    // Auth redirects render a perfect login page and every probe passes against
    // it, so the final path must be the path requested.
    const finalPath = new URL(page.url()).pathname;
    if (finalPath !== route && !out.result) {
      out.result = 'unknown';
      out.reason = 'auth-required';
      out.note = `requested ${route}, landed on ${finalPath}`;
    }
    const themeCheck = await checkTheme(page, theme, opts);
    if (themeCheck.applied === false && !out.result) {
      out.result = 'unknown';
      out.reason = 'theme-not-applied';
    }
    return emit({ ...base, themeCheck, ...out });
  } finally {
    await browser.close();
  }
}

async function load(ctx) {
  const { page, opts } = ctx;
  await page.goto(opts.url, { waitUntil: 'domcontentloaded' });
  if (opts['wait-for']) await page.waitForSelector(opts['wait-for']);
  else await page.waitForLoadState('networkidle').catch(() => {});
  if (opts['theme-click']) {
    await page.click(opts['theme-click']);
    await page.waitForTimeout(300);
  }
  if (opts.dir) await page.evaluate((d) => { document.documentElement.dir = d; }, opts.dir);
  if (opts.expand) {
    // Post-render expansion: cannot reach canvas text, placeholders, or strings a
    // later render replaces. Say so in the report.
    await page.evaluate(() => {
      const accent = { a: 'á', e: 'é', i: 'í', o: 'ö', u: 'ü', A: 'Å', E: 'É', O: 'Ø' };
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
      for (const n of nodes) {
        const t = n.nodeValue.trim();
        if (!t) continue;
        const pad = '~'.repeat(Math.ceil(t.length * 0.4));
        n.nodeValue = '[' + t.replace(/[aeiouAEO]/g, (c) => accent[c]) + pad + ']';
      }
    });
  }
}

async function checkTheme(page, theme, opts) {
  const state = await page.evaluate(() => ({
    className: document.documentElement.className,
    dataTheme: document.documentElement.dataset.theme ?? null,
    colorScheme: getComputedStyle(document.documentElement).colorScheme,
  })).catch(() => null);
  if (!state) return { applied: null };
  if (theme === 'light' || opts['theme-media-only']) return { applied: true, ...state };
  // emulateMedia alone does nothing for a class or data-theme app: assert it landed.
  const hit = state.className.split(/\s+/).includes(theme) || state.dataTheme === theme || state.colorScheme === theme;
  return { applied: hit, ...state };
}

// Decode two PNG screenshots in the page and count changed pixels, so the
// focus-ring check needs no image library.
async function pixelDelta(page, a, b) {
  return page.evaluate(async ([a64, b64]) => {
    const decode = async (s) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + s;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      return g.getImageData(0, 0, c.width, c.height).data;
    };
    const [x, y] = await Promise.all([decode(a64), decode(b64)]);
    if (x.length !== y.length) return 1;
    let changed = 0;
    for (let i = 0; i < x.length; i += 4) {
      if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 30) changed++;
    }
    return changed / (x.length / 4);
  }, [a.toString('base64'), b.toString('base64')]);
}

function padClip(box, viewport) {
  const x = Math.max(0, box.x - 6), y = Math.max(0, box.y - 6);
  return { x, y, width: Math.max(1, Math.min(box.w + 12, viewport.width - x)), height: Math.max(1, Math.min(box.h + 12, viewport.height - y)) };
}

const RUNNERS = {
  async 'axe-scan'(ctx) {
    const { page, write, shotPath, stem } = ctx;
    await load(ctx);
    const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
    const exclude = 'iframe[src*="stripe"], iframe[src*="youtube"], [data-consent-banner]';
    let results;
    const builder = await importFromRepo(['@axe-core/playwright']);
    if (builder) {
      const AxeBuilder = builder.default?.default ?? builder.default ?? builder.AxeBuilder;
      results = await new AxeBuilder({ page }).withTags(tags).exclude(exclude).analyze();
    } else {
      const axePath = resolveFromRepo('axe-core/axe.min.js');
      if (!axePath) return { result: 'unknown', reason: 'probe-error', note: 'neither @axe-core/playwright nor axe-core resolves from this repository' };
      await page.addScriptTag({ path: axePath });
      results = await page.evaluate(([t, ex]) => window.axe.run({ exclude: [ex] }, { runOnly: { type: 'tag', values: t } }), [tags, exclude]);
    }
    write(`axe-${stem}.json`, results);
    await page.screenshot({ path: shotPath(`${stem}.png`), fullPage: true });
    const byImpact = {};
    for (const v of results.violations) byImpact[v.impact] = (byImpact[v.impact] ?? 0) + v.nodes.length;
    return {
      observed: { violations: results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), byImpact,
        incomplete: results.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })) },
      excluded: exclude,
    };
  },

  async 'target-size'(ctx) {
    const { page, write, shotPath, stem } = ctx;
    await load(ctx);
    const elements = await page.evaluate(() => {
      const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, summary,' +
        '[role=button], [role=link], [role=checkbox], [role=radio], [role=switch],' +
        '[role=tab], [role=menuitem], [role=option], [tabindex]:not([tabindex="-1"])';
      const cssPath = (node) => {
        const parts = [];
        while (node && node.nodeType === 1) {
          if (node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
          const tag = node.localName;
          const sibs = node.parentElement ? [...node.parentElement.children].filter((n) => n.localName === tag) : [node];
          parts.unshift(`${tag}:nth-of-type(${sibs.indexOf(node) + 1})`);
          node = node.parentElement;
        }
        return parts.join(' > ');
      };
      const out = [];
      for (const el of document.querySelectorAll(SEL)) {
        if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        // Off-canvas panels pass checkVisibility; their centre falls outside the viewport.
        if (cx < 0 || cy < 0 || cx >= document.documentElement.clientWidth || cy >= document.documentElement.clientHeight) continue;
        if (getComputedStyle(el).pointerEvents === 'none') continue;
        // A 44x44 box centred on the element, sampled just inside its edges:
        // hit testing at an exact boundary can select a neighbour.
        const offsets = [-21.5, -11, 0, 11, 21.5];
        const covered = offsets.every((dx) => offsets.every((dy) => {
          const hit = document.elementFromPoint(cx + dx, cy + dy);
          return hit && (hit === el || el.contains(hit));
        }));
        out.push({
          selector: cssPath(el),
          text: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
          box: { w: Math.round(r.width), h: Math.round(r.height) },
          effective44: covered,
          inProse: el.matches('a[href]') && getComputedStyle(el).display === 'inline' && !!el.closest('p, [class*=prose]'),
        });
      }
      return out;
    });
    write('target-size.json', elements);
    await page.screenshot({ path: shotPath(`${stem}.png`), fullPage: false });
    const candidates = elements.filter((e) => (e.box.w < 44 || e.box.h < 44) && !e.effective44 && !e.inProse);
    const expanded = elements.filter((e) => (e.box.w < 44 || e.box.h < 44) && e.effective44);
    return { expected: { min: 44 }, observed: { measured: elements.length, candidates, expanded } };
  },

  async 'focus-walk'(ctx) {
    const { page, write, opts } = ctx;
    await load(ctx);
    await page.evaluate(() => document.body.focus());
    const limit = await page.evaluate(() => document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').length * 3 + 20);
    const trail = [];
    const focusedShots = [];
    const same = (a, b) => a && b && a.tag === b.tag && a.label === b.label && JSON.stringify(a.box) === JSON.stringify(b.box);
    for (let i = 0; i < limit; i++) {
      // Keyboard focus, not el.focus(): only keyboard focus matches :focus-visible.
      await page.keyboard.press('Tab');
      const step = await page.evaluate(() => {
        let el = document.activeElement;
        while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
        if (!el || el === document.body) return { escaped: true };
        el.scrollIntoView({ block: 'nearest' });
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, label: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40),
          box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          page: { x: Math.round(r.x + scrollX), y: Math.round(r.y + scrollY) },
          inViewport: r.top >= 0 && r.bottom <= innerHeight };
      });
      trail.push(step);
      if (!step.escaped && step.box.w > 0 && step.box.h > 0) {
        const clip = padClip(step.box, ctx.viewport);
        const shot = await page.screenshot({ clip }).catch(() => null);
        if (shot) focusedShots.push({ index: i, label: step.label, pagePos: step.page, size: { w: step.box.w, h: step.box.h }, shot });
      }
      if (trail.length > 2 && same(step, trail[0])) break;
    }
    // Second pass on a fresh load: the same regions with nothing focused.
    await load(ctx);
    const indicator = [];
    for (const f of focusedShots) {
      await page.evaluate(([x, y]) => window.scrollTo(Math.max(0, x - 20), Math.max(0, y - 20)), [f.pagePos.x, f.pagePos.y]);
      const box = await page.evaluate(([x, y, w, h]) => ({ x: x - scrollX, y: y - scrollY, w, h }), [f.pagePos.x, f.pagePos.y, f.size.w, f.size.h]);
      const unfocused = await page.screenshot({ clip: padClip(box, ctx.viewport) }).catch(() => null);
      if (unfocused) indicator.push({ index: f.index, label: f.label, delta: Number((await pixelDelta(page, unfocused, f.shot)).toFixed(4)) });
    }
    const pasteBlocked = await page.evaluate(() => [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea')]
      .filter((el) => el.checkVisibility())
      .filter((el) => {
        const dt = new DataTransfer();
        dt.setData('text/plain', 'probe');
        return !el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
      }).map((el) => el.name || el.id || el.getAttribute('aria-label') || el.type));
    let dialog = null;
    if (opts['dialog-trigger']) {
      const inDialog = () => page.evaluate(() => !!document.activeElement?.closest('[role=dialog],[role=alertdialog],dialog'));
      await page.focus(opts['dialog-trigger']);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);
      const focusMovedIn = await inDialog();
      let escapedTrap = false;
      for (let i = 0; i < 30 && focusMovedIn; i++) {
        await page.keyboard.press('Tab');
        if (!(await inDialog())) { escapedTrap = true; break; }
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      const closedOnEscape = await page.evaluate(() => !document.querySelector('[role=dialog]:not([hidden]),[role=alertdialog]:not([hidden]),dialog[open]'));
      const restoredToTrigger = await page.evaluate((sel) => document.activeElement === document.querySelector(sel), opts['dialog-trigger']);
      const activeAfter = await page.evaluate(() => document.activeElement?.tagName ?? null);
      dialog = { focusMovedIn, escapedTrap, closedOnEscape, restoredToTrigger, activeAfter };
    }
    write('focus-trail.json', { trail, indicator, pasteBlocked, dialog });
    // Chromium hands focus to the browser once per cycle at the document end,
    // so one `escaped` step is the boundary. The signal is tabbable elements the
    // walk never reached.
    const tabbable = await page.evaluate(() => [...document.querySelectorAll('a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter((el) => el.checkVisibility()).length);
    const visited = new Set(trail.filter((s) => !s.escaped).map((s) => JSON.stringify([s.tag, s.label, s.box]))).size;
    return { observed: { stops: trail.length, tabbable, visited, boundaries: trail.filter((s) => s.escaped).length, capped: trail.length >= limit,
      // Under ~2% of pixels changing on focus is a missing or invisible ring.
      lowIndicator: indicator.filter((s) => s.delta < 0.02), offscreen: trail.filter((s) => !s.escaped && !s.inViewport).length,
      pasteBlocked, dialog } };
  },

  async 'viewport-stress'(ctx) {
    const { page, write, shotPath, opts } = ctx;
    await load(ctx);
    const overflowAt = async () => page.evaluate(() => {
      const doc = document.scrollingElement;
      const overflow = doc.scrollWidth > doc.clientWidth + 1;
      const culprits = [];
      if (overflow) {
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (getComputedStyle(el).position === 'fixed') continue;
          let p = el.parentElement, scroller = false;
          while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o === 'auto' || o === 'scroll') { scroller = true; break; } p = p.parentElement; }
          if (scroller) continue;
          if (r.right > innerWidth + 1 || r.left < -1) culprits.push({ tag: el.tagName, cls: el.className?.toString().slice(0, 60), right: Math.round(r.right), width: Math.round(r.width) });
        }
      }
      const clipped = [...document.querySelectorAll('body *')].filter((el) => {
        if (!el.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) return false;
        const s = getComputedStyle(el);
        const cut = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
        const hidden = s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden';
        const affordance = s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none';
        return cut && hidden && !affordance;
      }).map((el) => ({ text: el.innerText.slice(0, 60), cls: el.className?.toString().slice(0, 60) }));
      const bodySize = parseFloat(getComputedStyle(document.querySelector('p') ?? document.body).fontSize);
      const smallInputs = [...document.querySelectorAll('input, textarea, select')].filter((el) => el.checkVisibility() && parseFloat(getComputedStyle(el).fontSize) < 16).length;
      const meta = document.querySelector('meta[name=viewport]')?.content ?? null;
      return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, overflow, culprits: culprits.slice(-10), clipped: clipped.slice(0, 20), bodySize, smallInputs, viewportMeta: meta };
    });
    const widths = opts.width ? [Number(opts.width)] : [320, 360, 768, 1280];
    const results = {};
    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(150);
      results[w] = await overflowAt();
      write(`overflow-${w}.json`, results[w]);
      if (results[w].overflow || results[w].clipped.length) await page.screenshot({ path: shotPath(`${w}.png`), fullPage: true });
    }
    // Triple every text node: the mechanical form of "does this survive a real customer name".
    await page.evaluate(() => {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
      for (const n of nodes) if (n.nodeValue.trim()) n.nodeValue = n.nodeValue.trim().repeat(3);
    });
    const narrow = Math.min(...widths);
    await page.setViewportSize({ width: narrow, height: 800 });
    const tripled = await overflowAt();
    write(`overflow-${narrow}-tripled.json`, tripled);
    return { observed: { widths: results, tripled } };
  },

  async 'console-network'(ctx) {
    const { page, write } = ctx;
    const log = { console: [], pageErrors: [], failed: [], badStatus: [] };
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.console.push({ type: m.type(), text: m.text(), at: m.location() }); });
    page.on('pageerror', (e) => log.pageErrors.push({ message: e.message, stack: e.stack }));
    page.on('requestfailed', (r) => log.failed.push({ url: r.url(), method: r.method(), reason: r.failure()?.errorText }));
    page.on('response', (r) => { if (r.status() >= 400) log.badStatus.push({ url: r.url(), status: r.status() }); });
    const preScroll = [];
    page.on('request', (r) => { if (['image', 'media'].includes(r.resourceType()) || r.frame() !== page.mainFrame()) preScroll.push(r.url()); });
    await load(ctx);
    const imagesBeforeScroll = [...new Set(preScroll)];
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const hydration = log.console.filter((c) => /hydrat|did not match|server-rendered/i.test(c.text));
    write('console.json', { ...log, imagesBeforeScroll });
    return { observed: { consoleErrors: log.console.filter((c) => c.type === 'error').length, warnings: log.console.filter((c) => c.type === 'warning').length,
      pageErrors: log.pageErrors.length, failed: log.failed.length, badStatus: log.badStatus.length, hydration: hydration.length, imagesBeforeScroll: imagesBeforeScroll.length } };
  },

  async 'failure-injection'(ctx) {
    const { page, write, shotPath, opts, stem } = ctx;
    if (!opts.route) return { result: 'unknown', reason: 'probe-error', note: '--route <glob> naming the data request is required' };
    const condition = opts.inject ?? '500';
    let matched = 0;
    const handler = (route) => {
      matched++;
      if (condition === 'abort') return route.abort('internetdisconnected');
      if (condition === 'empty') return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      if (condition === 'malformed') return route.fulfill({ status: 200, contentType: 'application/json', body: '{"items": [' });
      // The planted driver token and IP make a leaked-message assertion testable.
      return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'internal', detail: 'ECONNREFUSED 10.0.0.4:5432' }) });
    };
    await page.route(opts.route, handler);
    await load(ctx);
    if (matched === 0) return { result: 'unknown', reason: 'probe-error', note: `route pattern ${opts.route} matched no request; nothing was injected` };
    const rendered = await page.evaluate(() => ({
      alerts: [...document.querySelectorAll('[role=alert],[role=status]')].map((n) => n.innerText.trim()),
      bodyText: document.body.innerText.slice(0, 4000),
      actions: [...document.querySelectorAll('button,a[href]')].map((n) => n.innerText.trim()).filter(Boolean),
      blank: document.body.innerText.trim().length < 40,
    }));
    const leak = /\bat \S+ \(\S+:\d+:\d+\)|TypeError:|ReferenceError:|Prisma\w*Error|ECONNREFUSED|SQLSTATE|PG::|\b10\.0\.0\.4\b/.test(rendered.bodyText);
    const vague = /^(something went wrong|an error occurred|error|invalid|failed|oops|unknown error)\.?$/im.test(rendered.bodyText);
    let retry = null;
    if (condition !== 'empty') {
      await page.unroute(opts.route, handler);
      const pattern = new RegExp(opts['retry-name'] ?? 'try again|retry|reload', 'i');
      const control = page.getByRole('button', { name: pattern }).first();
      if (await control.count()) {
        const req = page.waitForRequest(opts.route, { timeout: 5000 }).then(() => true).catch(() => false);
        await control.click();
        retry = { control: true, refetched: await req };
      } else retry = { control: false, refetched: false };
    }
    write(`injection-${condition}.json`, { condition, matched, rendered, leak, vague, retry });
    await page.screenshot({ path: shotPath(`injection-${condition}-${stem}.png`), fullPage: true });
    return { observed: { condition, matched, blank: rendered.blank, alerts: rendered.alerts, leak, vague, retry } };
  },

  async 'layout-shift'(ctx) {
    const { page, write, shotPath, opts, timeout } = ctx;
    for (const k of ['route', 'loading-selector', 'loaded-selector', 'container-selector']) {
      if (!opts[k]) return { result: 'unknown', reason: 'probe-error', note: `--${k} is required` };
    }
    await page.addInitScript(() => {
      window.__shifts = [];
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.hadRecentInput) continue;
          window.__shifts.push({ value: e.value, startTime: e.startTime,
            sources: e.sources.map((s) => ({ node: (s.node?.tagName ?? '') + (s.node?.id ? '#' + s.node.id : ''), from: s.previousRect, to: s.currentRect })) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    // Delay the data, not the whole network: throttling the shell moves the
    // shift into a window that has nothing to do with the defect.
    let release;
    const gate = new Promise((r) => { release = r; });
    let intercepted = false;
    const hold = async (route) => { intercepted = true; await gate; await route.continue(); };
    await page.route(opts.route, hold, { times: 1 });
    let before, after, shifts, sawLoading = false;
    try {
      await page.goto(opts.url, { waitUntil: 'domcontentloaded' });
      sawLoading = await page.waitForSelector(opts['loading-selector'], { timeout }).then(() => true).catch(() => false);
      before = await page.locator(opts['container-selector']).boundingBox();
      await page.screenshot({ path: shotPath('loading.png') });
      release();
      await page.waitForSelector(opts['loaded-selector']);
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      after = await page.locator(opts['container-selector']).boundingBox();
      await page.screenshot({ path: shotPath('loaded.png') });
      shifts = await page.evaluate(() => window.__shifts);
    } finally {
      release();
      await page.unroute(opts.route, hold).catch(() => {});
    }
    write('shifts.json', { before, after, shifts });
    if (!intercepted || !sawLoading) return { result: 'unknown', reason: 'probe-error', note: intercepted ? 'loading state never observed' : 'route pattern matched no request' };
    const sum = shifts.reduce((a, s) => a + s.value, 0);
    return { observed: { beforeHeight: before?.height ?? null, afterHeight: after?.height ?? null,
      deltaPx: before && after ? Math.round(after.height - before.height) : null, shiftSum: Number(sum.toFixed(4)), entries: shifts.length } };
  },

  async 'web-vitals'(ctx) {
    const { page, context, write, opts } = ctx;
    const lib = resolveFromRepo('web-vitals/dist/web-vitals.attribution.iife.js');
    if (!lib) return { result: 'unknown', reason: 'probe-error', note: 'web-vitals does not resolve from this repository' };
    const cpu = Number(opts.cpu ?? 4);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    await page.addInitScript({ path: lib });
    await page.addInitScript(() => {
      window.__vitals = [];
      addEventListener('load', () => {
        const push = (m) => window.__vitals.push({ name: m.name, value: m.value, rating: m.rating, attribution: m.attribution });
        webVitals.onLCP(push); webVitals.onCLS(push); webVitals.onINP(push);
      });
    });
    // The first navigation after a build pays for cold server caches: measure the second.
    await page.goto(opts.url, { waitUntil: 'load' });
    await load(ctx);
    let interacted = false;
    if (opts.interact) {
      const [role, name] = opts.interact.split(':');
      const target = page.getByRole(role, { name: new RegExp(name, 'i') }).first();
      if (await target.count()) { await target.click(); interacted = true; }
    }
    await page.waitForTimeout(500);
    // Hidden visibility flushes LCP, CLS, and INP reports.
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true }); dispatchEvent(new Event('visibilitychange')); document.dispatchEvent(new Event('visibilitychange')); });
    const vitals = await page.evaluate(() => window.__vitals ?? []);
    write('vitals.json', { cpuThrottle: cpu, navigation: 'second', interacted, vitals });
    return { observed: { cpuThrottle: cpu, interacted, metrics: vitals.map((m) => ({ name: m.name, value: m.value, rating: m.rating })) },
      note: interacted ? undefined : 'no interaction driven, so INP is absent, not passing' };
  },

  async 'theme-capture'(ctx) {
    const { page, write, shotPath, stem } = ctx;
    await load(ctx);
    await page.screenshot({ path: shotPath(`${stem}.png`), fullPage: true });
    return { observed: { captured: true } };
  },
};

main().catch((err) => {
  emit({ result: 'unknown', reason: 'probe-error', error: String(err?.message ?? err) });
  process.exitCode = 1;
});

