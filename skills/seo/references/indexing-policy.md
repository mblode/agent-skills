# Indexing Policy

For changed route patterns, record index intent, preferred URL and reason. Expand to per-URL rows where exceptions matter.

- Index useful public pages that satisfy distinct reader needs. A sitemap should advertise preferred, available URLs intended for search, including eligible non-HTML resources where appropriate.
- For equivalent public URLs, select a canonical and align internal links and sitemaps. Redirect an obsolete copy when it no longer needs to remain accessible. Canonicals are signals, not guaranteed engine choices.
- Keep locale equivalents self-canonical and connect them with hreflang instead of canonicalizing every language to English.
- For previews, private utilities and deliberate exclusions, use appropriate access control and/or crawlable `noindex`. Robots blocking alone does not reliably remove a URL from results. Do not combine conflicting exclusion/consolidation signals as a default duplicate strategy.
- Return 404 or 410 for permanently missing content, 503 for temporary unavailability, and a real server redirect for moved content. Do not funnel unrelated deleted pages to the homepage.
- Do not list unavailable studio, login or app-shell routes merely because they exist in source. Share the availability decision with the sitemap generator.
- `lastmod` reflects significant content, structured-data or link changes. Build/request time is not a substitute; omit an unknown date. Check current sitemap limits before partitioning large inventories.

## Programmatic pages

Validate demand, product fit and a distinct useful result before indexing a new pattern. Reuse, merge or improve an existing page when it already serves the intent. Original data, meaningful local differences, worked examples and genuine comparisons can justify separate pages; swapping a location or adjective alone does not.

Define the indexability gate and lifecycle for empty results, out-of-stock resources and retired entities. Do not generate fan-out permutations primarily to manipulate search or AI answers. See the current spam policy in `sources.md` when a proposed pattern approaches scaled content abuse.
