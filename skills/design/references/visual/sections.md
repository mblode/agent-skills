# Page Sections

Marketing and landing-page section rules. A hero loads Heading Groups; any stacked page section loads Landing Pages and Section Layout.

## Contents

- Section Layout
- Landing Pages
- Heading Groups
- Headers
- Footers
- Feature Lists
- Logo Clouds
- Pricing Cards
- Team Sections
- Testimonials
- Login Pages
- Prose Content

## Section Layout

Covers: page sections, constrained containers, centered vs left-aligned layouts, section padding, grids, stacked content alignment.

### Design Rules

- Align left-aligned sections to the page container edge: never narrow `max-w-*` + `mx-auto`; use a page-level `max-w-*` and constrain inner content separately.
- Align containers and boundings that occupy the same proportion across stacked sections: e.g. a 1/2-width card grid and a 1/2-width split with bounding below share the same column edges. Use consistent grid definitions and gap values so edges line up when scrolling.
- Avoid nested max-width on grids/lists that fill their container: if a feature grid or icon list spans the full constrained width, don't add a narrower `max-w-*`; align it to the page container edges, not floating in the middle. Nested `max-w-*` is fine for self-contained units meant to feel bounded (pricing cards, forms, comparison tables, centered media).
- Use a three-step spacing rhythm so grouping reads from the gaps: tightest within a group, more between groups, most between sections (e.g. 8px / 16px / 32-40px). Keep the same jumps across the page, not per-spot gaps.
- Give shared chrome one owner. Before adding a page title, global action, close or done control, or navigation affordance in a leaf component, inspect the shell and layout so it renders exactly once.
- Keep captions, helper text, and status lines in the tightest spacing group with the media or control they explain.
- Size compact forms, dialogs, and focused panels to their task and content before expanding to available width. Empty canvas is valid when it protects the glance path.
- Measure spacing between visible contrast edges, not invisible boxes. If a block has a tinted background, the section gap starts at the background edge, not at the first line of text inside it.
- Every element should align to a neighbor or a grid edge for a reason. Floating offsets are only acceptable when they create an intentional optical correction or hierarchy.
- In rows or columns of mixed visual weight, order from heaviest to lightest with the heaviest element on the outside edge. This keeps action groups and link clusters stable when scanned.

### Coding Rules

- Two-element pattern for constrained sections: outer handles background and vertical padding, inner handles max-width, centering, and horizontal padding:

  ```html
  <... class="{vertical-padding}">
    <... class="{max-width} mx-auto {horizontal-padding}">
      ...
    </...>
  </...>
  ```

  Apply consistently across all sections so content edges align when scrolling.

## Landing Pages

Covers: landing pages, marketing pages, stacked page sections, heroes, CTAs, pricing sections, feature sections, full-page consistency.

- Reuse one primary/secondary button style across the whole page: if the hero's secondary is link-style, every section's secondary action (CTA, pricing, etc.) is link-style too.
- Reuse the same font treatment (size, weight, color) wherever the same or similar idea repeats: match the existing instance exactly.
- Reuse one container style across the page: once set (outline, tinted, etc.), all later containers match.
- Use one border radius for all sibling containers at the same level (panels, cards).
- Use one column `gap-*` across all multi-column sections (card grids, split layouts): check existing sections and match the value already in use before adding a new one.
- Never place a centered layout directly below a left-aligned one; use left-aligned, unless the section above ends with full-width containers, a background color change, or a visible divider separates them.
- Never have more centered heading groups than left-aligned on a landing page: center heroes, CTAs, and symmetrical content (centered pricing cards, logo clouds); default to left-aligned for feature grids, split layouts, and content-heavy sections.

## Heading Groups

Covers: headline, subheadline, and optional eyebrow groups atop marketing/landing sections.

A heading group is a headline and subheadline (and optional eyebrow) at the top of a marketing or landing section: the title and description above a feature grid, team grid, pricing table, testimonial section, CTA, or hero. These rules apply to promotional/marketing sections only, not blog posts, articles, documentation, or editorial content.

The measures below are heading measures, deliberately tighter than body text. Running body copy is a different range, owned by the typography audit (`rules-typography/`) and the `type-readable-scale` floor; a 24ch headline is correct here and is not a violation of it.

- Never constrain the heading group wrapper's width: no `max-w-*`, no `max-lg:max-w-*`, no width constraint of any kind on the wrapper `<div>`. Constrain each text element (headline, subheadline) individually with `max-w-[*ch]` directly on it: `text-base` → `max-w-[56ch]`, `text-lg` → `max-w-[48ch]`, `text-xl` → `max-w-[40ch]`, `text-2xl`, `text-3xl` → `max-w-[40ch]`, `text-4xl` → `max-w-[35ch]`, `text-5xl` → `max-w-[30ch]`, `text-6xl` → `max-w-[24ch]`, `text-7xl` → `max-w-[20ch]`.

  ```html
  <div class="/* never add a max width here */">
    <h2 class="mx-auto max-w-[35ch] text-4xl font-semibold tracking-tight text-balance">…</h2>
    <p class="mx-auto mt-6 max-w-[48ch] text-lg text-pretty text-gray-600">…</p>
  </div>
  ```

- Use a left-aligned layout when the subheadline exceeds ~120 characters (~3 lines when centered).
  - **⚠️ ask-user** if a centered layout is requested but the subheadline exceeds ~120 characters: offer a rewritten version that fits; only center if the user accepts the shorter copy.

## Headers

Covers: site headers, navigation bars, top bars, logos, mobile menus, hamburger menus, header CTAs.

### Design Rules

- Wrap the main logo in `<a href="/">` with `aria-label="Homepage"`
- Navbar buttons must feel secondary to the hero's primary CTA: use ghost, outline, subtle, or a smaller solid button; matching the hero color is fine if the navbar button is noticeably smaller

## Footers

Covers: page footers, footer logos, footer navigation, footer links, and social media icons.

### Design Rules

- Logo height between `h-5` and `h-7`
- Use `font-normal` for footer links
- Social icons at least `text-gray-600`: never `text-gray-400` or lighter

### Coding Rules

- Use the placeholder logo endpoint in `assets.md` when no logo file is provided; never build logos from HTML or icons

## Feature Lists

Covers: feature grids, benefit lists, product feature sections, and any section listing multiple features with titles and descriptions.

- Use `<dl>`/`<dt>`/`<dd>` for feature sections listing multiple features, not `<ul>`/`<li>` or plain `<div>` groups

## Logo Clouds

Covers: logo grids, customer logos, partner logos, trust bars, client rows, and collections of brand marks.

- Distribute logos evenly across rows when wrapping; never an unbalanced last row. Use a grid that splits as evenly as possible (e.g. 3+3, not 5+1, for 6 logos)
- A logo cloud directly beneath a hero extends the hero: match its alignment; left-aligned hero → left-aligned label and logos

## Pricing Cards

Covers: pricing tiers, pricing cards, pricing tables, plan comparisons, emphasized plans, popular/recommended plans.

### Design Rules

- Emphasize cards via button styling and optional "Popular" or "Recommended" text: never a different background color for the whole card.
- For feature-list checkmarks, follow Icons in `components.md`: use `size-4 h-lh` to vertically center with text.

### Coding Rules

- Never isolate the emphasized card: it's a grid sibling, not a standalone section.
- Align buttons across cards with `flex flex-col justify-between` on each card; wrap all content above the button in one `<div>` so the button pushes to the bottom:

```html
<div class="flex flex-col justify-between …">
  <div>
    <!-- name, price, description, features -->
  </div>
  <div>
    <button>Get started</button>
  </div>
</div>
```

- If the emphasized card is taller than its siblings, use CSS grid with explicit rows (never negative margins or relative positioning): the gap rows define how far the card pokes out, unemphasized cards sit in the middle row, the emphasized card spans all rows.

```html
<!-- Pokes out top and bottom -->
<div class="{breakpoint}:grid-cols-3 {breakpoint}:grid-rows-[--spacing(6)_1fr_--spacing(6)] grid">
  <div class="{breakpoint}:row-start-2"><!-- normal card --></div>
  <div class="{breakpoint}:row-span-full"><!-- emphasized card --></div>
  <div class="{breakpoint}:row-start-2"><!-- normal card --></div>
</div>

<!-- Pokes out top only -->
<div class="{breakpoint}:grid-cols-3 {breakpoint}:grid-rows-[--spacing(6)_1fr] grid">
  <div class="{breakpoint}:row-start-2"><!-- normal card --></div>
  <div class="{breakpoint}:row-span-full"><!-- emphasized card --></div>
  <div class="{breakpoint}:row-start-2"><!-- normal card --></div>
</div>
```

## Team Sections

Covers: team grids, member cards, staff listings, about-us sections, people galleries, photos, names, roles, bios.

### Design Rules

- Never use landscape aspect ratios for team images
- Use a muted color for role/job title text

### Coding Rules

- Render people lists as `<ul>` with `<li>` items
- Use `alt=""` on team photos when the name is visible nearby

## Testimonials

Covers: customer quotes, reviews, social proof sections, testimonial cards, quote punctuation, avatars, and attribution.

### Design Rules

- Hanging punctuation for quotes: `relative before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']`
- Bottom-align avatars/names across equal-height cards: `flex flex-col justify-between` per card; wrap quote and attribution in separate elements
- Never add whitespace inside quote `<p>` tags: write `<p>The quote text</p>` not `<p> The quote text </p>` (breaks hanging punctuation)
- Photos follow Avatars in `components.md` and the placeholder rules in `assets.md`
- Use unisex names so random avatars fit any name

## Login Pages

Covers: login, sign-in, sign-up, authentication, password reset, and account access pages.

- Never use light-tinted backgrounds (e.g. `bg-gray-50`, `bg-gray-100`, `bg-slate-50`) on login/sign-in pages: use solid white (`bg-white`) or dark (`bg-gray-900`, `bg-gray-950`, `bg-black`), unless the form is in a distinct panel or card

## Prose Content

Covers: raw HTML from markdown, CMS content, database content, blog posts, articles, documentation, and rendered markup where classes can't be applied to individual elements.

- Never use the `@tailwindcss/typography` plugin: instead create a `.prose` class that styles raw HTML elements (headings, links, lists, code blocks, images, etc.) with plain CSS using Tailwind's CSS theme variables (`var(--color-*)`, `var(--text-*)`, `var(--font-weight-*)`, `var(--radius-*)`, `--spacing(*)`, `--alpha()`); use `@variant dark { … }` and `@variant hover { … }` for dark mode and hover states; use `* + *` for vertical spacing between elements; style every element that could appear: `h1`, `h6`, `p`, `a`, `ul`, `ol`, `li`, `pre`, `code`, `img`, `strong`, `blockquote`
- Apply the `.prose` wrapper class to the container holding the rendered HTML: `<div class="prose">` around blog post content, markdown output, CMS-generated markup, or any HTML where you can't add Tailwind classes to individual elements
- Default to `var(--text-base)` (`16px`) for prose body text; use `var(--text-lg)` (`18px`) or larger only if specifically requested or if the project already uses that size for body text elsewhere
- Never set `max-width` in `.prose` CSS: constrain with a `max-w-[*ch]` class alongside `prose` (e.g. `<div class="prose max-w-[65ch]">`); use `60ch` to `75ch`, matched to the site's content widths. Go past `75ch` only for a documented reason such as a two-column layout or a code-heavy documentation page where wrapping costs more than measure, and raise leading toward `1.75` when you do
- Set prose body `line-height` to `1.6-1.75x` the font size: e.g. `--spacing(7)` for `var(--text-base)`. Go higher only past `80ch`, and constrain the measure before reaching for extra leading.
- Use `text-pretty` on blog post and article titles, not `text-balance`
- If the article `h1` is sans-serif, use the same sans-serif for all subheadings (`h2`, `h6`); never mix a sans-serif title with serif subheadings
