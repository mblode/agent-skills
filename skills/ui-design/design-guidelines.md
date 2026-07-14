# UI Design Guidelines

Use when designing or building new UI, or when a workflow tells you to load design guidance before editing UI code.

## Load Contract

- Before writing UI code, scan the index below and load every rule file that could apply; err toward loading too many.
- Treat rules as applicable even when indirect: heading-group rules apply to hero sections; landing-page rules to individual page sections; surface rules to dashboard cards and list items.
- Load reference modules only when the request needs that material.

## General Design Principles

- Every layout must adapt from mobile to desktop via responsive breakpoint classes; see [Responsive Design](./guidelines/responsive-design.md) for detailed rules.

## Rule Files

Follow these when designing or building UI:

- [Avatars](./guidelines/avatars.md): profile photos, user thumbnails, people images in testimonials, team sections, comments, anywhere a person's face appears
- [Badges](./guidelines/badges.md): tags, pills, status indicators, labels, chips, with or without icons
- [Border Radius](./guidelines/border-radius.md): rounding corners on cards, containers, buttons, images, screenshots, and nested elements with concentric radii
- [Buttons](./guidelines/buttons.md): primary/secondary buttons, CTAs, icon buttons, destructive/danger actions, touch targets
- [Colors](./guidelines/colors.md): brand colors, accent colors, palette selection, default color choices
- [Copywriting](./guidelines/copywriting.md): punctuation, periods, headings, taglines, subtitles, descriptions, list items
- [Custom Fonts](./guidelines/custom-fonts.md): loading custom fonts via `<link>` or `@import url()`, registering in `@theme` with `--font-*`, font-feature-settings, font-variation-settings
- [Dark Mode](./guidelines/dark-mode.md): dark theme styling, contrast ratios, colored panels, card backgrounds, shadow removal, decorative elements, heading colors, dark-mode image handoff, inline/external SVG dark-mode handling
- [Description Lists](./guidelines/description-lists.md): `<dl>`/`<dt>`/`<dd>` styling, term/detail contrast and font-weight hierarchy
- [Dashboards](./guidelines/dashboards.md): dashboard layouts, stat grids, KPI cards, metric cards, admin panels, analytics views, key statistics, charts, summary data
- [Feature Lists](./guidelines/feature-lists.md): feature grids, feature sections, benefit lists, multiple features with titles and descriptions
- [Flexbox Layout](./guidelines/flexbox-layout.md): flex containers, flex children, `min-w-0` shrinking, `shrink-0` on icons/images/SVGs, fluid vs fixed layouts, sidebar + content patterns, `flex-1` or flexible sizing
- [Footers](./guidelines/footers.md): page footers, footer logos, footer links, social media icons, site-wide bottom navigation
- [Form Controls](./guidelines/form-controls.md): inputs, selects, checkboxes, radio buttons, login/sign-up/checkout forms, search bars, newsletter sign-up fields, input + button combos
- [General](./guidelines/general.md): general markup rules (class placement on block vs inline elements, redundant display classes, `role="list"`) and Tailwind CSS authoring rules (utility preferences, spacing conventions, arbitrary value syntax, variant patterns, deprecated utilities) across all components
- [Headers](./guidelines/headers.md): site headers, navigation bars, navbars, top bars, logos, mobile menus, hamburger menus
- [Heading Groups](./guidelines/heading-groups.md): headline, subheadline, optional eyebrow at the top of marketing and landing page sections (hero, features, team, pricing, CTA); not blog posts, articles, or editorial content
- [Icons](./guidelines/icons.md): SVG icons, icon sizing, alignment with text, Heroicons, filled vs stroked icons, inline list icons like checkmarks
- [Images](./guidelines/images.md): photos, thumbnails, screenshots, app UI mockups, image borders/outlines
- [Landing Pages](./guidelines/landing-pages.md): full-page consistency for buttons, fonts, containers, border radius, column gaps, layout alignment, responsive constraints across all sections
- [Login Pages](./guidelines/login-pages.md): login, sign-in, sign-up, and authentication page backgrounds and layout
- [Logo Clouds](./guidelines/logo-clouds.md): logo grids, client logo rows, partner logos, trust bars, brand-logo collections
- [Materials](./guidelines/materials.md): translucent chrome, backdrop-filter layers, material weight as hierarchy, vibrancy text legibility, scroll edge effects, reduced-transparency fallbacks
- [Navigation](./guidelines/navigation.md): sidebar nav, header nav, mobile nav menus, tabs, tab bars, vertical menus, active/selected states, current-page indicators
- [Pagination](./guidelines/pagination.md): page number links, previous/next buttons, paged navigation controls
- [Placeholder Content](./guidelines/placeholder-content.md): dummy logos, placeholder avatars, app screenshots, wallpapers, and the assets API for generating realistic placeholder content
- [Prose Content](./guidelines/prose-content.md): styling raw HTML from markdown, CMS, or database content where Tailwind classes can't be applied to individual elements; replaces `@tailwindcss/typography` with a custom `.prose` class
- [Pricing Cards](./guidelines/pricing-cards.md): pricing tiers, pricing tables, plan cards, emphasized/popular plan styling, button alignment across columns
- [Responsive Design](./guidelines/responsive-design.md): responsive breakpoints, container queries, `@container` placement, mobile-to-desktop layout adaptation
- [SVG](./guidelines/svg.md): inline SVG elements, `xmlns` attributes, SVG color styling (`fill`, `stroke`, `currentColor`), SVG markup conventions in HTML/JSX
- [Section Layout](./guidelines/section-layout.md): left-aligned vs centered section layouts, content width constraints, aligning containers across stacked page sections
- [Shadows](./guidelines/shadows.md): box shadows on cards, modals, popovers, dropdowns, elevated elements, including border-pairing rules
- [Surfaces](./guidelines/surfaces.md): cards, wells, borders, dividers, and white space as surface treatments; when to use cards vs subtle dividers vs recessed backgrounds vs no separation; applies to stat grids, dashboard metrics, list items, sidebars, any content grouping decision
- [Tables](./guidelines/tables.md): data tables, comparison tables, table headings, row dividers, table containers
- [Team Sections](./guidelines/team-sections.md): team grids, team member cards, staff listings, about-us sections, people galleries with photos and bios
- [Testimonials](./guidelines/testimonials.md): customer quotes, reviews, social proof sections, testimonial cards, hanging punctuation, attribution layout
- [Typography](./guidelines/typography.md): font weights, line heights, text sizes, heading styles, max-width constraints, text-pretty/text-balance, tracking, eyebrow text

## Reference Modules

Load these only when the request needs the reference:

- [Assets API](./guidelines/assets-api.md): placeholder asset URLs, query parameters, examples for marks, avatars, logos, screenshots, wallpapers
- [Font Recommendations](./guidelines/font-recommendations.md): optional font suggestions when the user wants help choosing a font or wants to try different fonts across design variations; includes sourcing notes, feature settings, and per-font tips

## Design Conflicts

When a rule says **⚠️ ask-user**, the user's input conflicts with a guideline. Don't silently override or follow it. Instead:

1. Use the `AskUserQuestion` tool to flag the conflict.
2. Explain what the guideline recommends and why the input doesn't fit.
3. Offer a concrete alternative (e.g. a rewritten version of their copy, a different layout).
4. Wait for the user to choose before proceeding.

Never skip this, even when it feels minor: the user should always be aware when their input bumps up against a design rule.
