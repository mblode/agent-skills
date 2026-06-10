# Internationalisation (SEO layer)

How multilingual/multi-regional sites tell search engines which version to serve. Covers URL strategy, `hreflang`, and localised metadata. For runtime formatting (dates/numbers/plurals) and the language switcher UI, that's the `ux-audit` skill's `dark-i18n-*` rules.

## Contents
- [URL strategy](#url-strategy)
- [hreflang](#hreflang)
- [Localised metadata](#localised-metadata)
- [Avoid IP-based redirects](#avoid-ip-based-redirects)

## URL strategy

Pick **one** pattern for all locales and keep it:

| Pattern | Example | Notes |
|---|---|---|
| Subdirectory | `example.com/de/`, `example.com/fr/` | Simplest; inherits domain authority. Usually the default. |
| Subdomain | `de.example.com` | More setup; separate signals. |
| ccTLD | `example.de` | Strongest geo signal; most expensive to run. |

Optionally localise the slugs too (`/de/produkte` not `/de/products`).

## hreflang

Declare each language/regional alternate with **BCP 47** codes (`en`, `en-GB`, `de`, `pt-BR`). Rules:
- **Reciprocal:** every alternate must list every other alternate, including itself.
- Include a self-reference.
- Add `x-default` for the unmatched-locale fallback.
- Place in **one** location only (HTML `<head>`, HTTP `Link` headers, **or** the XML sitemap, see below), not duplicated.

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/page" />
<link rel="alternate" hreflang="de" href="https://example.com/de/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/page" />
```

In the sitemap (good for scale: keeps localisation metadata out of the head):

```xml
<url>
  <loc>https://example.com/en/page</loc>
  <xhtml:link rel="alternate" hreflang="de" href="https://example.com/de/page"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/page"/>
</url>
```

## Localised metadata

Translate **everything in the head and structured data**, not just the body. A localised body with an English `<title>` is a half-translation. Translate:
- `<title>`, `<meta name="description">`
- Open Graph `og:title` / `og:description` (and `og:locale`)
- JSON-LD `name` / `description` fields
- image `alt` text

See `nextjs-implementation.md` for the `generateMetadata` + `alternates.languages` pattern.

## Avoid IP-based redirects

Do **not** auto-redirect visitors to a locale based on IP geolocation or `Accept-Language`. It traps users in the wrong language, breaks search crawlers (which crawl from one region), and breaks shared links. Instead:
- Serve the requested URL's locale as-is.
- Optionally show a dismissible banner suggesting another locale ("View this page in Deutsch?"), never a hard redirect.
- Let the user choose via the language switcher.
