# Internationalisation

Use hreflang for equivalent language or regional pages, not unrelated content that happens to target different countries.

- Use supported language codes with optional region codes and fully qualified URLs. A region by itself is invalid.
- Include self-reference and reciprocal links among the variants being declared. Missing reciprocity affects those annotations; it does not necessarily invalidate every correctly reciprocal subset on the site.
- Keep translated pages self-canonical unless they truly duplicate another preferred URL. Do not canonicalize all languages to the source-language page.
- `x-default` is optional. Its absence alone is neither a defect nor a reason to add it. Recommend it when an actual selector or unmatched-locale destination needs declaring.
- HTML, HTTP headers and XML sitemaps are equivalent implementation methods. Prefer one maintainable source; using more than one is allowed, but keep them consistent.
- Translate meaningful titles, descriptions, headings, alt text and user-facing schema values. Preserve the identity of shared organizations and people.
- Keep locale URLs independently accessible. Avoid mandatory IP/language redirects that prevent a reader or crawler from reaching another language.

Validate representative reciprocal pairs and an unmatched-language visit. Record missing annotations and canonical conflicts precisely rather than reporting the whole set as broken. Check Google's current localized-version documentation in `sources.md` for supported codes and exceptions.
