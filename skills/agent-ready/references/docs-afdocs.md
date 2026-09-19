# Docs: AFDocs and Mintlify Agent Score

Read when the report is Mintlify Agent Score, `npx afdocs`, or any `llms.txt` / markdown / truncation finding.

Follow the published formats exactly. Do not invent page copy; reuse titles and URLs already in the docs. Ask for source files when a listed page is not in the repo.

## Contents

- Baseline
- `llms.txt`
- Directives
- Markdown twins
- Size and structure
- Auth
- Other knowledge surfaces
- Framework routes

## Baseline

```bash
npx afdocs check <docs-url> --format scorecard --sampling deterministic
```

Iterate with `--checks <id>` plus its dependencies. `llms-txt-valid` needs `llms-txt-exists`. Markdown size, fence, and parity checks need `.md` URLs or `Accept: text/markdown`.

Candidate `llms.txt` locations: `{docsBase}/llms.txt`, `{origin}/llms.txt`, `{origin}/docs/llms.txt`. Canonical is the longest directory prefix of the URL you scored. Serve it on the docs host; a cross-host redirect is a warn.

## `llms.txt`

[llmstxt.org](https://llmstxt.org/) order: optional BOM, required H1, blockquote summary, optional notes (no extra headings), then H2 sections of lists. Each item is `[title](url)` plus optional `: one-line description`. An `## Optional` section is for skippable links.

Keep the file under 50,000 characters. Split with nested `llms.txt` files before 100,000. Link markdown URLs, not HTML, once twins exist.

Regenerate from the docs inventory at build time so `llms-txt-coverage` stays current. Default AFDocs thresholds: pass at 95% of sitemap doc pages, fail under 80%. Built-in exclusions include `/blog`, `/pricing`, `/about`, `/legal`, `/login`. If the index is curated, say so in the summary rather than stuffing unrelated URLs.

```text
# Acme API

> Acme processes payments through a REST API. Agents start at this index, then fetch markdown twins.

## Docs

- [Authentication](https://docs.acme.com/auth.md): keys, headers, sandbox vs live
- [Rate limits](https://docs.acme.com/rate-limits.md): quotas and 429 retry

## Optional

- [Changelog](https://docs.acme.com/changelog.md): dated notes
```

Use the site's real titles and URLs, never invented pages.

## Directives

Must appear in the HTML **body**, not `<head>`, `<nav>`, or `<script>`, and in the first 50% of the converted page. Server-render them.

The markdown twin's directive matters more than the HTML one. Converting a page to markdown removes the sidebar and breadcrumbs, so an agent that lands on a twin has nothing to navigate with and guesses sibling URLs; in Mintlify's url-discovery-bench that guessing cost 1.42 failed requests per task on plain markdown against 0.11 once every twin linked `llms.txt`. Ship the twin link before anything else in this file.

HTML (visually hidden, stays in the DOM):

```html
<p class="sr-only">
  For AI agents: the documentation index is at
  <a href="/llms.txt">/llms.txt</a>.
  Append <code>.md</code> to this URL or send
  <code>Accept: text/markdown</code> for markdown.
</p>
```

Markdown twin, first lines after any title (absolute URLs, since agents fetch twins from any base):

```markdown
> ## Documentation index
> [Documentation index](https://docs.acme.com/llms.txt)
> [HTML page](https://docs.acme.com/auth)
> Use the index to discover pages before guessing URLs.
```

Emit it from the same route that renders the twin, so no page can miss it. Inlining the whole `llms.txt` into every page is the benchmark's fourth arm; the report does not publish its result, so prefer the link and keep the twin small.

Use the actual `llms.txt` path (`/docs/llms.txt` when that is canonical). Also emit HTTP links when you can set headers without fighting the framework:

```http
Link: </llms.txt>; rel="describedby", </docs/example.md>; rel="alternate"; type="text/markdown"
```

## Markdown twins

Every docs HTML URL must answer at the same path with `.md` appended (or `index.md` on directory URLs) with `200` and a markdown body.

Honor `Accept: text/markdown` on the HTML URL:

| Header | Value |
|--------|--------|
| `Content-Type` | `text/markdown; charset=utf-8` |
| `Vary` | `Accept` |
| Unsupported combination | `406` when the client rejects every representation you offer |

`text/plain` or HTML with a markdown body is a warn. Serve the same source the HTML was built from so `markdown-content-parity` holds. Mark human-only chrome with `data-markdown-ignore` rather than drifting the two copies.

Cache `llms.txt` and markdown with `max-age` of 300–3600 plus `ETag` or `Last-Modified`. Multi-day `max-age` with no revalidation fails `cache-header-hygiene`.

## Size and structure

| Check | Pass | Fix |
|-------|------|-----|
| `rendering-strategy` | Substantive HTML without JS | Enable SSR/SSG; do not ship empty SPA shells |
| `content-start-position` | Main content in first 10% of converted text | Move sidebars/breadcrumbs after or beside main; do not serialize the full nav first |
| `page-size-*` | Under 50k characters | Split mega-pages; do not serialize every tab into one document |
| `tabbed-content-serialization` | Tabs under 50k serialized | Per-variant URLs or `?lang=` returning one variant |
| `section-header-quality` | Headers unique across tabs | `Step 1 (Python)` not `Step 1` |
| `markdown-code-fence-validity` | Fences closed with the same delimiter | Nested fences use a longer run of backticks |
| `http-status-codes` / redirects | Real 404s, same-host HTTP 3xx | No JS-only redirects, no soft 404s |

## Auth

Public reference and getting-started pages should fetch without a session. If a gate is required, publish an ungated `llms.txt` plus an alternate path (public mirror, shipped SDK docs). Do not put public docs behind bot challenges that HTML-only agents cannot pass.

## Other knowledge surfaces

Agents answer from whatever the origin serves, and most companies keep product knowledge on five or more surfaces while only the docs are agent-readable. Walk the sitemap and the homepage nav for changelog, release notes, help center, community, status, and API status pages. For each surface the product owns, decide once:

| Surface | Twins and index entry | Why |
|---------|----------------------|-----|
| Changelog, release notes, migration guides | Yes, under `## Optional` if the main list is long | Agents act on stale parameters; the changelog is where the fix lives |
| Help center, FAQ, troubleshooting | Yes | These answer the questions the docs did not |
| Community threads, forum | Only when the company hosts and stands behind the answers | Unvetted answers propagate as fact |
| Marketing, pricing, legal, careers | No | AFDocs excludes them; listing them dilutes the index |

A surface on a different host or CMS is a product decision to record, not something to fake with a copy in the docs repo.

## Framework routes

This file is the AFDocs contract (shape, headers, thresholds). In a Next.js App Router site, implement the handlers with `seo`: that skill's `nextjs-implementation.md` for the route and `proxy.ts` matcher, and `answer-engines.md` for Accept/`Vary`/canonicals. Inspect the app's existing `llms.txt` route before adding another.
