# Next.js Implementation

Read the installed version's documentation under `node_modules/next/dist/docs` (possibly at the workspace root) before changing APIs. The checks below name observed failure modes; they are not a permanent version compatibility table.

## Metadata

- Set `metadataBase` for the production origin and emit the page's preferred canonical. Verify basePath behavior in a production build, especially generated versus static Open Graph images.
- Preserve DNS ownership verification. Use `metadata.verification` only for a supplied token and the selected verification method.
- Choose descriptive titles and descriptions for the page purpose. Check truncation and redundancy as presentation concerns, not fixed 50/60/44-character validity gates. Title templates apply to child routes; inspect the resolved title and social title separately.
- Nested metadata objects such as `openGraph` can replace parent values rather than deep-merge. Restate or share the fields that should survive. Avoid an inherited homepage `openGraph.url` on every route.
- Set preview controls deliberately. `max-image-preview:large` permits larger previews; `max-snippet:-1` permits unrestricted snippet length. These are permission controls, not ranking boosts or guaranteed excerpt lengths. Preserve intentional restrictions and check current engine controls.
- Use author/entity attribution where it describes the content. A person, product, organization and website are distinct entities; `sameAs` identifies the same entity, not every associated organization.

## Sitemaps and rendering

Implement sitemaps from the authoritative public route inventory. Use content modification dates or omit them; availability-gated pages must follow the same gate as their routes. Fetch emitted XML and its URLs after building.

A generated sitemap collection may need an explicit index or discovery entries. Verify the installed version's `generateSitemaps` parameters and output paths instead of reconstructing them from memory. Sitemap caches and upstream CDNs can outlive the app deploy; verify the public response.

Server-render the principal text and navigational anchors on indexable hubs and detail pages. Client Components can prerender; mounting guards, viewport-dependent state and effect-only fetching can still remove the useful initial HTML. Keep a useful visible fallback for readers without JavaScript and enhance it after hydration. Verify the visual transition, not just raw text counts.

Cache Components changes available route configuration and caching APIs. Verify support before adding `dynamic`, `revalidate` or `fetchCache` exports. Choose content-aware invalidation and account for CDN caching separately.

## Status codes and redirects

A `notFound()` or redirect after streaming starts may produce a 200 shell with metadata or a client redirect. For routes that require a true 404 or 3xx, validate existence or redirect before streaming using a supported routing boundary. Test the actual status with an invented path and a migrated URL.

Redirect specificity and basePath prefixing affect matching. Check bare roots, trailing slashes, query strings and Markdown twins. Preserve legitimate deep paths, avoid loops, and verify the final destination's status and canonical.

For Next versions that use `proxy.ts`, use the documented exported handler, runtime and matcher format. Check the compiled behavior for exact versus descendant matches. Do not migrate unrelated middleware solely because an SEO file changed.

## Structured data

Use types appropriate to the visible page and current supported search features. Stable `@id` references can connect entities across consistent JSON-LD blocks; one `@graph` is an optional organization convention. Script count alone is not an error.

Derive markup from the same data as the rendered content. Check claims, links, dates, prices, reviews and author identities against what the page actually provides. Some schema properties need no literal visible label; the underlying claim still needs to be accurate and supported. Validate rich-result eligibility separately from JSON syntax and schema vocabulary validity.

Escape `<` when embedding serialized JSON-LD in a script:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(data).replaceAll('<', '\\u003c'),
  }}
/>
```

Check the current feature documentation before promising FAQ, Article, Product or other rich results. A schema.org type can remain valid after a Google presentation feature is retired.

## Images, headers and performance

Read generated social image URLs from the built output and fetch them. Do not infer extensions, host or basePath resolution from filenames. A declared OG URL whose response is HTML or 404 is a defect.

Metadata may stream for one user agent and block in the head for another. Exercise the framework's HTML-limited bot path as well as browser/Google-style requests, especially for pages that read build-only filesystem assets. Verify server behavior, not a grep that counts escaped RSC metadata twice.

A nonce CSP may require dynamic rendering and reduce caching. Do not add it solely to silence an SEO scanner. CORP is a browser response policy, not proof that a server-side social scraper cannot fetch an image. Diagnose the real request, MIME type and delivery failure.

Keep the LCP resource discoverable early, reserve layout space and measure interaction delays. Use supported image priority/loading APIs for the installed version. Field measurements and lab diagnostics belong in separate evidence columns.
