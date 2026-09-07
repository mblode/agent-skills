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
| Measurement | native search reports, engine-specific AI reporting, qualified conversions | search impressions, prompt volume, citations and sessions are not interchangeable |

## Crawl scope

Follow sitemap indexes recursively, deduplicate URL entries and preserve which sitemap advertised each URL. Fetch listed destinations with bounded concurrency. Sample every route pattern, host/proxy boundary and locale; expand when a defect affects a pattern. Crawl navigational links as needed to find non-sitemap URLs and compare against the intended route inventory for orphans.

Record requested and final URL, redirect chain, status, MIME type, robots directives, canonical, title, main content and structured-data parse results. Collect HTML metadata from HTML elements, not SVG `title` elements or escaped React payload strings. Inspect actual anchors for discovery, not only strings in JavaScript.

Prioritize systemic exclusions, wrong canonicals and broken destinations before lower-impact duplication. Unknown paths should return genuine missing-page behavior. Check both initial HTML and the rendered page before attributing missing content to rendering.

## Findings contract

Each material finding names the affected URL/pattern, observation, evidence, impact, correction and verification method. Mark inference and missing evidence explicitly. Separate existing baseline failures from regressions introduced by the fix. A checked item can be pass, fail, not applicable or not measured, with the reason.

Prioritization follows business impact, affected scope, confidence and correction cost. Avoid fake numerical precision, fixed finding quotas and reports padded with irrelevant checks. For a healthy site, say which checks passed and which performance questions remain unanswered.

Separate verified defects, optional enhancements and unmeasured state. An owner requesting a crawler policy does not establish the current robots rules; inspect them before claiming they are missing or permissive. Recommend an optional annotation only when the observed site needs its behavior.
