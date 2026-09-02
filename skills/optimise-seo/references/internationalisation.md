# Internationalisation (SEO layer)

How multilingual and multi-regional sites tell search engines which version to serve: URL strategy, `hreflang`, and localised metadata. Runtime formatting (dates, numbers, plurals, RTL) and the language switcher UI belong to `ui-design`.

## Contents

- [URL strategy](#url-strategy)
- [hreflang](#hreflang)
- [Localised metadata](#localised-metadata)
- [No IP or Accept-Language redirects](#no-ip-or-accept-language-redirects)

## URL strategy

Pick one pattern for all locales and keep it:

| Pattern | Example | Notes |
|---|---|---|
| Subdirectory | `example.com/de/`, `example.com/fr/` | Simplest; inherits domain authority. The default. |
| Subdomain | `de.example.com` | More setup; signals split per host. |
| ccTLD | `example.de` | Strongest geo signal; most expensive to run. |

Localising the slugs (`/de/produkte`, not `/de/products`) is optional and a mild win for click-through.

## hreflang

Declare each alternate with a BCP 47 code (`en`, `en-GB`, `de`, `pt-BR`). Google's rules, all of which are ignore-the-whole-set failures when broken:

- Reciprocal: every alternate lists every other alternate, and itself.
- `x-default` names the fallback for unmatched locales.
- One location only: HTML `<head>`, HTTP `Link` headers, or the XML sitemap. Duplicating across two is a source of drift.
- The canonical of a localised page is that page (or the same-language substitute), never the English original. A canonical pointing across languages silently drops the localised page from results.

In the head, via `generateMetadata`:

```tsx
export async function generateMetadata(
  { params }: { params: Promise<{ locale: string; slug: string }> }
): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(slug, locale)
  return {
    title: post.title,            // translated per locale
    description: post.excerpt,    // translated per locale
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        de: `/de/blog/${slug}`,
        'x-default': `/en/blog/${slug}`,
      },
    },
    openGraph: { locale: locale === 'de' ? 'de_DE' : 'en_US' },
  }
}
```

In the sitemap, which scales better and keeps the head small (Next.js 14.2+):

```ts
// app/sitemap.ts rows
{
  url: `${origin}/en/blog/${slug}`,
  lastModified,
  alternates: { languages: { en: `${origin}/en/blog/${slug}`, de: `${origin}/de/blog/${slug}` } },
}
```

Emit one row per locale, each carrying the full alternates set including itself; a row that lists only the other locales is a non-reciprocal set.

## Localised metadata

Translate the head and the structured data, not only the body. An English `<title>` over a German page is a half-translation that ranks for neither:

- `<title>`, `<meta name="description">`
- `og:title`, `og:description`, `og:locale`
- JSON-LD `name`, `description`, `headline`, and `inLanguage`
- image `alt` text

## No IP or Accept-Language redirects

Do not auto-redirect to a locale by geolocation or `Accept-Language`. Googlebot crawls mostly from US IPs, so a redirect hides every non-US locale from it, and a shared link lands the recipient in the wrong language with no way back. Serve the requested URL as-is, offer a dismissible banner ("View this page in Deutsch?"), and let the switcher do the rest.

The Next.js internationalisation guide shows the opposite: a `proxy.ts` that reads `Accept-Language` and redirects to `/${locale}${pathname}`. That example is about routing, not indexing. If a site keeps it, scope the matcher to the bare root (`/`) as the guide's own comment suggests, so a deep link or a crawler landing on `/de/pricing` is never bounced, and make the redirect a 307 so nothing caches it.
