# Prose Content

Covers: raw HTML from markdown, CMS content, database content, blog posts, articles, documentation, and rendered markup where classes can't be applied to individual elements.

- Never use the `@tailwindcss/typography` plugin: instead create a `.prose` class that styles raw HTML elements (headings, links, lists, code blocks, images, etc.) with plain CSS using Tailwind's CSS theme variables (`var(--color-*)`, `var(--text-*)`, `var(--font-weight-*)`, `var(--radius-*)`, `--spacing(*)`, `--alpha()`); use `@variant dark { … }` and `@variant hover { … }` for dark mode and hover states; use `* + *` for vertical spacing between elements; style every element that could appear: `h1`, `h6`, `p`, `a`, `ul`, `ol`, `li`, `pre`, `code`, `img`, `strong`, `blockquote`
- Apply the `.prose` wrapper class to the container holding the rendered HTML: `<div class="prose">` around blog post content, markdown output, CMS-generated markup, or any HTML where you can't add Tailwind classes to individual elements
- Default to `var(--text-base)` (`16px`) for prose body text; use `var(--text-lg)` (`18px`) or larger only if specifically requested or if the project already uses that size for body text elsewhere
- Never set `max-width` in `.prose` CSS: constrain with a `max-w-[*ch]` class alongside `prose` (e.g. `<div class="prose max-w-[65ch]">`); use `60ch`, `90ch`, matched to the site's content widths
- Set prose body `line-height` to at least `1.75x` the font size: e.g. `--spacing(7)` for `var(--text-base)`
- Use `text-pretty` on blog post and article titles, not `text-balance`
- If the article `h1` is sans-serif, use the same sans-serif for all subheadings (`h2`, `h6`); never mix a sans-serif title with serif subheadings
