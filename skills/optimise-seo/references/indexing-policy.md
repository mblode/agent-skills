# Indexing policy

## Redirects and indexing policy

- Permanent moves are 308 (`permanent: true`, `permanentRedirect()`); temporary are 307. One hop, straight to the final URL, and set at one layer (edge or `next.config.ts`, not both).
- A missing page returns a real 404. In the App Router that means the existence check runs before anything streams; otherwise the response is 200 plus a `noindex` meta, which Search Console reports as a soft 404. Under Cache Components every dynamic route streams its shell first, so the check lives in `proxy.ts`, not in the page.
- Every route has an explicit index decision. Public pages are `index, follow`; staging, admin, thin, and private routes get `metadata.robots` (HTML) or `X-Robots-Tag` (non-HTML, whole environments).
- Duplicates consolidate through `rel="canonical"`, not `noindex`: a `noindex`ed page passes nothing to the canonical. Previews and staging are the case for `noindex`; Vercel sets it on preview URLs automatically but not on a custom domain attached to a non-production branch.
- Thin hubs (empty author, tag, category, pagination pages) stay `noindex` and out of the sitemap until they carry unique content, and no placeholder or lorem page ships indexable.
- Syndicated copies of one story all point at one canonical URL. Publish on the origin first, wait until Search Console shows it indexed, then syndicate; a platform copy that goes live first outranks the origin even with the canonical set later.

## Programmatic SEO (pages at scale)

- Validate demand for the pattern before generating pages; `seo-program` supplies the numbers
- Each page needs unique value backed by data it alone has; templated text swaps are doorway pages
- Clean subfolder URLs, hub-and-spoke linking, breadcrumbs everywhere
- Index the strong pages; `noindex` the long tail until a page earns its place, then add a link and index it
- Under Cache Components, `generateStaticParams` must return at least one param (an empty array raises `empty-generate-static-params`). List the strong pages there; unlisted slugs get the App Shell on first visit and are upgraded in the background, which needs `partialPrefetching: true`

