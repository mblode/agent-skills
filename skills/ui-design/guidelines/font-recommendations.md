# Font Recommendations

Covers: optional font suggestions, type-direction exploration, and font ideas for design variations.

Optional. Reference only when font selection is part of the task; never force them.

## Contents

- [General Guidelines](#general-guidelines)
- [By Purpose](#by-purpose)
- [Font Details](#font-details)

## General Guidelines

- Default to Inter for body/UI unless the user is exploring other options.
- Recommend sans-serif unless the user asks for serif, says "sophisticated" or "editorial", or the project calls for it (luxury brand, literary magazine, fashion editorial).

## By Purpose

Name lists only; see [Font Details](#font-details) for traits, sourcing, and registration.

### Body & UI

- Sans-serif: [DM Sans](#dm-sans), [Figtree](#figtree), [General Sans](#general-sans), [Geist](#geist), [Host Grotesk](#host-grotesk), [Inter](#inter), [Instrument Sans](#instrument-sans), [Mona Sans](#mona-sans), [Satoshi](#satoshi)
- Serif: [Lora](#lora)

### Headlines & Display

Most Body & UI fonts also head well; strongest display picks:

- Sans-serif: [DM Sans](#dm-sans), [Fixel Display](#fixel-display) (display only), [Geist](#geist), [Inter](#inter), [Mona Sans (wide)](#mona-sans) (headlines only), [Satoshi](#satoshi)
- Serif: [Instrument Serif](#instrument-serif)

### Monospace

For code, inline code, or a technical/developer aesthetic.

- [Geist Mono](#geist-mono), [IBM Plex Mono](#ibm-plex-mono)

---

## Font Details

### DM Sans

Low-contrast geometric, open apertures, large x-height. Single-storey `a`/`g`, straight-legged `R`. Excellent at small sizes; great body font paired with other headline fonts, also heads.

- **Source:** Google Fonts (`family=DM+Sans:opsz,wght@9..40,100..1000`)
- **Registration:** in `@theme`, `--font-sans: "DM Sans", sans-serif;`
- **Pairs with:** Inter, Geist

### Figtree

Friendly geometric; curved `t`/`f`/`y` add warmth without playfulness. Monolinear stroke. Headlines and body.

- **Source:** Google Fonts (`family=Figtree:wght@300..900`)
- **Registration:** in `@theme`, `--font-sans: "Figtree", sans-serif;`
- **Pairs with:** Inter, Geist, DM Sans

### Fixel Display

Geometric-humanist hybrid, open letterforms, wide proportions. Headlines and display only, never body.

- **Source:** self-host from `https://fixel.macpaw.com`
- **Registration:** in `@theme`, `--font-display: "Fixel Display", sans-serif;`
- **Pairs with:** Inter, Geist, DM Sans

### Geist

Swiss-inspired Vercel sans: minimal, precise, built for UI. Body, app UI, headings.

- **Source:** Google Fonts (`family=Geist:wght@100..900`)
- **Registration:** in `@theme`, `--font-sans: "Geist", sans-serif;`
- **Pairs with:** Inter, DM Sans

### Geist Mono

Vercel monospace. Code snippets, inline code, developer sites.

- **Source:** Google Fonts
- **Registration:** in `@theme`, `--font-mono: "Geist Mono", monospace;`

### IBM Plex Mono

IBM monospace: versatile, highly legible. Code, technical content, developer sites.

- **Source:** Google Fonts (`family=IBM+Plex+Mono:wght@400;500;600;700`)
- **Registration:** in `@theme`, `--font-mono: "IBM Plex Mono", monospace;`

### General Sans

Compact rationalist sans, small apertures, disciplined closed feel. Space-efficient for dense UI and tight layouts. Headlines and body.

- **Source:** Fontshare (`https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap`)
- **Registration:** in `@theme`, `--font-sans: "General Sans", sans-serif;`
- **Pairs with:** Inter, Geist, DM Sans

### Host Grotesk

Uniwidth sans: letter widths stay constant across weights, so weight changes never shift layout. Ideal for tabs, buttons, navigation, anywhere reflow must not happen. Headlines and body.

- **Source:** Google Fonts (`family=Host+Grotesk:wght@300..800`)
- **Registration:** in `@theme`, `--font-sans: "Host Grotesk", sans-serif;`
- **Pairs with:** Inter, Geist, DM Sans

### Instrument Sans

Geometric neo-grotesque from straight lines and simple circles. Uniform strokes, straight terminals, 12 stylistic sets for alternate glyphs. Clean technical interfaces. Headlines and body.

- **Weight restriction:** only supports `font-normal` (400): never use `font-medium`, `font-semibold`, or `font-bold`
- **Source:** Google Fonts (`family=Instrument+Sans:wght@400..700`)
- **Registration:** in `@theme`, `--font-sans: "Instrument Sans", sans-serif;`
- **Pairs with:** Inter, Geist, DM Sans

### Instrument Serif

High-contrast editorial serif for headlines and display. Premium editorial feel paired with a clean sans body; great for marketing sites, landing pages, brand-forward designs.

- **Sizing:** optically small: never use `text-4xl` or smaller for headings; use `text-5xl` and up where other fonts would use `text-4xl`
- **Source:** Google Fonts
- **Registration:** in `@theme`, `--font-display: "Instrument Serif", serif;`
- **Pairs with:** Inter, Geist, DM Sans

### Inter

Clean, highly legible screen sans. Body, app UI, headings.

- **Source:** `https://rsms.me/inter/inter.css` or self-host; never the Google Fonts version (lacks the Display optical-size variant and `font-feature-settings` support)
- **Optical sizing:** Display variant auto-activates at larger sizes via `font-optical-sizing: auto`; the Google Fonts build strips this out
- **Feature settings:** turn on optional OpenType features for a more custom feel: `cv02` (double-story `a`→single-story), `cv03` (open `6`/`9`), `cv04` (open `4`), `cv11` (single-story `l`), `ss01` (open digits), `ss03` (round quotes)
- **Registration:** in `@theme`, `--font-sans: "InterVariable", sans-serif;` with `--font-sans--font-feature-settings: "cv02", "cv03", "cv04", "cv11";` for global features
- **Pairs with:** Geist, DM Sans

### Lora

Contemporary serif with calligraphic roots. Moderate contrast, subtle brush-stroke terminals; refined yet readable at body sizes. Editorial, blogs, long-form; also heads.

- **Source:** Google Fonts (`family=Lora:wght@400..700`)
- **Registration:** in `@theme`, `--font-serif: "Lora", serif;`
- **Pairs with:** Inter, Geist, DM Sans, Satoshi

### Mona Sans

GitHub neo-grotesque with an optical-size axis that adjusts letterforms by size. Strong, industrial. Headlines and body.

- **Source:** Google Fonts (`family=Mona+Sans:wght@200..900`)
- **Width axis:** has a `wdth` variable axis: use a wider value (e.g. `"wdth" 112.5`) for headlines to give a bolder, more expanded feel; the wide variant is strictly for headlines, never for body copy
- **Registration:** in `@theme`, `--font-sans: "Mona Sans", sans-serif;`; for the wide headline variant also add `--font-display: "Mona Sans", sans-serif;` with `--font-display--font-variation-settings: "wdth" 112.5;`
- **Pairs with:** Inter, Geist, DM Sans

### Satoshi

Modernist sans blending rounded shapes with sharp angular details. Double-storey `a`/`g` add personality beyond typical geometrics; lean in for brand-forward designs. Headlines and body.

- **Source:** Fontshare (`https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700,900&display=swap`)
- **Registration:** in `@theme`, `--font-sans: "Satoshi", sans-serif;`
- **Pairs with:** Inter, Geist, DM Sans
