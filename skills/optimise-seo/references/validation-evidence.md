# Validation evidence

Copy `references/seo-checklist.md`, mark each line, and attach command evidence:

| Check | Command or source | Expected |
|---|---|---|
| Production build | `npm run build 2>&1 \| tail -20` (or repo equivalent) | exits 0 |
| Response headers | `curl -sI <url>` | correct status, canonical host, no `x-powered-by` |
| Redirects | `curl -sIL <old-url> \| grep -Ei "^(HTTP/\|location:)"` for every rule and every alternate host | exactly one 308 then a 200; no chain, no 404 destination |
| Local production check | A production build started on a verified free port owned by this task | the served app matches this checkout and build; never kill an unrelated listener |
| Served metadata | `curl -s -A Twitterbot <url> \| rg "canonical\|og:\|twitter:\|application/ld\+json"` | tags present in `<head>` |
| Robots | `curl -s <origin>/robots.txt` | expected allow and disallow, sitemap lines, per-class AI rules, any `Content-Signal` |
| Sitemap | `curl -s <origin>/sitemap.xml \| head -40` | absolute URLs, content-derived `lastmod`, every generated file reachable |
| Missing page | `curl -s -o /dev/null -w '%{http_code}\n' <origin>/definitely-missing` | 404 |
| AI crawler access | `curl -s -o /dev/null -w '%{http_code}\n' -A OAI-SearchBot <url>` (repeat for `Claude-SearchBot`, `PerplexityBot`) | 200 and the body is the page, not a challenge |
| Agent readiness | `npx is-agentic <domain> --json` | score plus failed-check list, before and after |
| Lighthouse | `npx lighthouse <url> --only-categories=seo,performance --output=json --output-path=.lighthouse-seo.json --quiet` | SEO and Performance at or above 90, or blockers listed |
| Core Web Vitals (field) | PageSpeed Insights or the CrUX API for the origin | p75 LCP, INP, CLS in target, or the failing metric named |
| Structured data | Rich Results Test per URL | valid, warnings cleared, unsupported types documented |
| Schema versus DOM | `curl -s <url>`, then compare every JSON-LD `name`, `text`, `headline`, and breadcrumb label against the rendered HTML with `script`, `style`, and `template` stripped. Compare word sequences after decoding entities and removing React's `<!-- -->` markers, not raw strings: the JSON holds the literal character and the HTML holds the entity, and `{a}{b}` ships as `free<!-- -->dom` | every claim visible on the page; no contradictory or duplicated entities; multiple JSON-LD blocks are valid when their claims agree |
| Metadata merge | `curl -s -A Twitterbot <inner-route> \| rg "og:site_name\|og:image\|twitter:creator"` on three inner routes sampled from the sitemap, not the home page | fields inherited from the root layout still present on routes that declare their own `openGraph` or `twitter` |
| Search Console after deploy | Pages report and enhancement reports | no new warnings; indexed and excluded changes explained. "Excluded by noindex" on Markdown twins, "Blocked by robots.txt" on disallowed paths, and "Discovered, currently not indexed" on new pages are expected states, not defects |

Report remaining blockers with exact URLs and an owner for each.

