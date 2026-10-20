# Metadata Copy

A page title or meta description is copy. It chooses the query a page competes for and how the brand is positioned in results and AI answers. A rewrite that reads well can still pull a page off its target query, or set two pages against each other. Find the project's metadata standard and owner first (a style guide, a content pipeline, a page catalogue). The defaults below apply only where the project states nothing.

## Mechanical fix or new wording

| Mechanical: ship within the authorized scope | New wording: needs owner sign-off |
|---|---|
| Removing a doubled brand suffix (`X - Brand \| Brand`) | Any change to the words that target a query |
| Fixing a typo, mojibake or a broken character | Changing title case or the separator where the standard is not written down |
| Making Open Graph and Twitter titles match the page title | A new description, or rewriting an existing one |
| Filling an empty social description by copying the page description | Adding a product claim, a figure or a third-party name |

Correcting copy to a written house rule (sentence case, spelling, date format) is mechanical only when the project documents that rule. Otherwise it is new wording.

## Checks for new wording

1. **Target.** Use the page's target keyword from the content pipeline or catalogue. If neither has one, the owner sets it; do not invent it.
2. **No cannibalisation.** Search the catalogue and the existing titles in the repository for the keyword. If another page already targets it, stop and ask.
3. **House style.** Apply the project's rules, or the defaults below.
4. **Review.** Request the SEO owner's review on the PR. Priority pages (home, pricing, the main feature, solution and audience hubs) always need it before merge.

## Leave alone during a technical audit

Do not rewrite titles on priority pages, pages already signed off, pages about to be redesigned, or campaign pages. Their wording is a positioning call. Leave them as-is, even with a known defect, and list them for the owner with the suggested fix. A title that names partners, payment providers, prices or capabilities makes a product claim: confirm it, or leave it out.

Keep technical fixes (indexing, canonicals, sitemaps, structured data, image paths) and copy changes in separate commits, and preferably in separate PRs, so copy review does not block crawl fixes.

## Default house style

| Rule | Default |
|---|---|
| Case | Sentence case; keep the capitals in brand and product names |
| Brand | `Page title \| Brand`, with a pipe separator and the brand once; add the suffix only if it fits |
| Punctuation | No dashes, ampersands or ellipses |
| Spelling | The locale's standard spelling, consistently (for example US English: optimize, color, trademark) |
| Dates | One documented format across pages |
| Terms | Product and glossary names exactly as the glossary spells them |
| Figures | Real figures only, each with a source; no competitor names outside comparison pages |
| Length | Title at most 60 characters including the brand suffix; description 140 to 160 characters, in one or two full sentences |
| Locales | Each localized page is written in its own language under the same rules, not left in the source language |

These lengths are display conventions, not ranking requirements.
