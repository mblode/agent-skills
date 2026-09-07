# Validation Evidence

Choose probes for the changed behavior, not a fixed command quota. Record commands, timestamp, exact requested/final URLs, environment/build identity and relevant results. Preserve unrelated processes and edits; use an available port owned by this task for local serving.

## Built-page checks

1. Run the repository's applicable lint/type/build checks. Use a production build when metadata, static generation or prerendering is involved.
2. Fetch the actual HTML response and parse title, canonical, meta/header directives, headings, anchors and JSON-LD. Do not count SVG titles, escaped payloads or script string matches as HTML elements.
3. For rendering changes, compare raw HTML with the browser DOM and inspect the visual result with and without JavaScript. Check the affected route pattern, a detail route and a missing path.
4. For sitemap changes, parse emitted XML, verify advertised URLs and compare lastmod to the content source. For redirects, inspect the complete chain and terminal status/canonical.
5. For AI access, probe relevant user-agent paths, then distinguish those results from authenticated crawler logs or engine URL inspection. For content negotiation, test both representations and cache request orders.
6. Check JSON-LD syntax, entity consistency and current rich-result eligibility separately. Multiple consistent blocks are valid; DNS ownership does not require a duplicate meta token.

## Completion evidence

Report each applicable check as passed, failed, not applicable or not measured. A local pass supports local behavior only. After an authorized deployment, wait for readiness, verify deployment identity and repeat the material probes through the real public host/CDN. A deployed source change with an unchanged cached public response remains unverified.

Use Search Console/Bing inspection where available for engine-observed indexing. State `No data` if unavailable; neither sitemap submission nor a crawler 200 response establishes index inclusion.

Report field Core Web Vitals independently of lab diagnostics. Verify current thresholds when assessing performance; conventional good thresholds are LCP <=2.5s, INP <=200ms and CLS <=0.1 at the 75th percentile. Specify URL/origin aggregation, device and date window. Missing field data is not a pass.
