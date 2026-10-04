# Audit

Start with the actual property and public host. Record the environment, URL sample and coverage so a sitemap crawl is not described as a complete index audit.

## Triage

| Area | Inspect | Avoid false positives |
|---|---|---|
| Discovery and access | robots groups, sitemap indexes and children, response statuses, CDN challenges, internal links | robots permission is not proof of successful crawling; footer links are crawlable, though contextual links improve discovery and meaning |
| Index intent | meta/header noindex, canonical destination, duplicate bodies, redirects, missing paths | self-canonicals do not consolidate duplicates; sitemap inclusion is not index inclusion |
| Rendering | initial HTML versus rendered DOM, main content, headings, anchors, mobile parity | `use client` can still prerender; a JavaScript-dependent page is not automatically absent from Google |
| Metadata and entities | meaningful titles/descriptions, canonical, social images, JSON-LD consistency and eligibility | no fixed title length or one-script rule; valid JSON is not rich-result eligibility |
| Experience | field LCP, INP, CLS where available; lab diagnostics and interactions | lab scores cannot substitute for missing field data; low word count alone is not a defect in a functional tool |
| Content and demand | reader intent, original evidence, comparison accuracy, overlapping pages, conversion path | do not infer demand from a keyword in a title or invent product facts |
| AI search (AEO, GEO) | crawler groups, retrieval snippet test, extractable claims, consistent entity naming, content freshness, third-party coverage of the category | owned-site readiness does not establish citations; `llms.txt`, schema and answer-block length are not citation requirements |
| Measurement | native search reports, engine-specific AI reporting, qualified conversions | search impressions, prompt volume, citations and sessions are not interchangeable |

## Crawl scope

Follow sitemap indexes recursively, deduplicate URL entries and preserve which sitemap advertised each URL. Fetch listed destinations with bounded concurrency. Sample every route pattern, host/proxy boundary and locale; expand when a defect affects a pattern. Crawl navigational links as needed to find non-sitemap URLs and compare against the intended route inventory for orphans.

Record requested and final URL, redirect chain, status, MIME type, robots directives, canonical, title, main content and structured-data parse results. Collect HTML metadata from HTML elements, not SVG `title` elements or escaped React payload strings. Inspect actual anchors for discovery, not only strings in JavaScript.

Prioritize systemic exclusions, wrong canonicals and broken destinations before lower-impact duplication. Unknown paths should return genuine missing-page behavior. Check both initial HTML and the rendered page before attributing missing content to rendering.

## Findings contract

Each material finding names the affected URL/pattern, observation, evidence, impact, correction and verification method. Mark inference and missing evidence explicitly. Separate existing baseline failures from regressions introduced by the fix. A checked item can be pass, fail, not applicable or not measured, with the reason.

Prioritization follows business impact, affected scope, confidence and correction cost. Avoid fake numerical precision, fixed finding quotas and reports padded with irrelevant checks. For a healthy site, say which checks passed and which performance questions remain unanswered.

Separate verified defects, optional enhancements and unmeasured state. An owner requesting a crawler policy does not establish the current robots rules; inspect them before claiming they are missing or permissive. Recommend an optional annotation only when the observed site needs its behavior.

## Indexing policy

For changed route patterns, record index intent, preferred URL and reason. Expand to per-URL rows where exceptions matter.

- Index useful public pages that satisfy distinct reader needs. A sitemap should advertise preferred, available URLs intended for search, including eligible non-HTML resources where appropriate.
- For equivalent public URLs, select a canonical and align internal links and sitemaps. Redirect an obsolete copy when it no longer needs to remain accessible. Canonicals are signals, not guaranteed engine choices.
- Keep locale equivalents self-canonical and connect them with hreflang instead of canonicalizing every language to English.
- For previews, private utilities and deliberate exclusions, use appropriate access control and/or crawlable `noindex`. Robots blocking alone does not reliably remove a URL from results. Do not combine conflicting exclusion/consolidation signals as a default duplicate strategy.
- Return 404 or 410 for permanently missing content, 503 for temporary unavailability, and a real server redirect for moved content. Do not funnel unrelated deleted pages to the homepage.
- Do not list unavailable studio, login or app-shell routes merely because they exist in source. Share the availability decision with the sitemap generator.
- `lastmod` reflects significant content, structured-data or link changes. Build/request time is not a substitute; omit an unknown date. Check current sitemap limits before partitioning large inventories.

### Programmatic pages

Validate demand, product fit and a distinct useful result before indexing a new pattern. Reuse, merge or improve an existing page when it already serves the intent. Original data, meaningful local differences, worked examples and genuine comparisons can justify separate pages; swapping a location or adjective alone does not.

Define the indexability gate and lifecycle for empty results, out-of-stock resources and retired entities. Do not generate fan-out permutations primarily to manipulate search or AI answers. See the current spam policy in `sources.md` when a proposed pattern approaches scaled content abuse.

## Internationalisation

Use hreflang for equivalent language or regional pages, not unrelated content that happens to target different countries.

- Use supported language codes with optional region codes and fully qualified URLs. A region by itself is invalid.
- Include self-reference and reciprocal links among the variants being declared. Missing reciprocity affects those annotations; it does not necessarily invalidate every correctly reciprocal subset on the site.
- Keep translated pages self-canonical unless they truly duplicate another preferred URL. Do not canonicalize all languages to the source-language page.
- `x-default` is optional. Its absence alone is neither a defect nor a reason to add it. Recommend it when an actual selector or unmatched-locale destination needs declaring.
- HTML, HTTP headers and XML sitemaps are equivalent implementation methods. Prefer one maintainable source; using more than one is allowed, but keep them consistent.
- Translate meaningful titles, descriptions, headings, alt text and user-facing schema values. Preserve the identity of shared organizations and people.
- Keep locale URLs independently accessible. Avoid mandatory IP/language redirects that prevent a reader or crawler from reaching another language.

Validate representative reciprocal pairs and an unmatched-language visit. Record missing annotations and canonical conflicts precisely rather than reporting the whole set as broken. Check Google's current localized-version documentation in `sources.md` for supported codes and exceptions.

## Delivery and access

Load this when response handling interferes with discovery. Security/privacy work unrelated to the SEO defect belongs to the relevant project workflow.

- Check both the public proxy host and origin where permitted. Correct source code can still serve an auth page, WAF challenge or cached error at the public URL.
- Verify robots directives in HTML and HTTP headers, including CDN-added fields. Preview deployments on custom domains need an explicit indexing policy; do not assume the platform adds noindex on every hostname.
- Use 503 plus an appropriate Retry-After for temporary unavailability. A long outage can still affect search visibility; the header does not guarantee retention.
- Distinguish browser-enforced CSP/CORP/CORS restrictions from server-to-server fetches. Verify the failing consumer and actual resource response before weakening headers.
- Check static files, redirects and generated metadata under the deployed basePath. Inspect image MIME type and actual content rather than trusting a 200 response.
- For robots changes, verify group precedence and private-route exclusions. Do not disable the WAF globally to accommodate a crawler; use verified identity and the narrow affected rule.
- Do not write real credentials, verification tokens or private analytics exports into public artifacts. Preserve existing ownership verification and request the required scoped access through the host's supported authentication flow.

Legal consent and retention requirements vary by property and jurisdiction. Do not turn a generic SEO checklist into a blanket legal compliance assertion or change consent settings to improve measured conversions.
