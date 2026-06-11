# UI Design Guidelines

Use this when designing or building new UI with the top-level `design` skill, or when a workflow tells you to load design guidance before editing UI code.

## Load Contract

- Before writing UI code, scan the rule-file index below and load every rule file that could apply.
- Err on the side of loading too many rule files rather than too few.
- Treat rules as applicable even when they are indirect: heading group rules apply to hero sections; landing page rules apply to individual page sections; surface rules apply to dashboard cards and list items.
- Load reference modules only when the user's request needs that reference material.

## General Design Principles

- Every layout must adapt from mobile to desktop: use responsive breakpoint classes to adjust the design at different screen sizes; see [Responsive Design](./guidelines/responsive-design.md) for detailed rules

## Rule Files

Follow these rules when designing or building UI. Each rule file covers a specific topic:

- [Avatars](./guidelines/avatars.md): profile photos, user thumbnails, and people images used in testimonials, team sections, comments, and anywhere a person's face appears
- [Badges](./guidelines/badges.md): badges, tags, pills, status indicators, labels, and chips with or without icons
- [Border Radius](./guidelines/border-radius.md): rounding corners on cards, containers, buttons, images, screenshots, and nested elements with concentric radii
- [Buttons](./guidelines/buttons.md): primary and secondary buttons, CTAs, icon buttons, destructive/danger actions, and touch targets
- [Colors](./guidelines/colors.md): brand colors, accent colors, color palette selection, and default color choices
- [Copywriting](./guidelines/copywriting.md): punctuation, periods, headings, taglines, subtitles, descriptions, and list items
- [Custom Fonts](./guidelines/custom-fonts.md): loading custom fonts via `<link>` tags or `@import url()`, registering fonts in `@theme` with `--font-*`, font-feature-settings, and font-variation-settings
- [Dark Mode](./guidelines/dark-mode.md): dark theme styling, contrast ratios, colored panels, card backgrounds, shadow removal, decorative elements, heading colors, dark-mode image handoff, and inline/external SVG dark-mode handling
- [Description Lists](./guidelines/description-lists.md): `<dl>`, `<dt>`, and `<dd>` styling, term/detail contrast and font weight hierarchy
- [Dashboards](./guidelines/dashboards.md): dashboard layouts, stat grids, KPI cards, metric cards, admin panels, analytics views, and any section displaying key statistics, charts, or summary data
- [Feature Lists](./guidelines/feature-lists.md): feature grids, feature sections, benefit lists, and any section that lists multiple features with titles and descriptions
- [Flexbox Layout](./guidelines/flexbox-layout.md): flex containers, flex children, `min-w-0` shrinking behavior, `shrink-0` on icons/images/SVGs, fluid vs fixed layouts, sidebar + content patterns, and any layout using `flex-1` or flexible sizing
- [Footers](./guidelines/footers.md): page footers, footer logos, footer links, social media icons, and site-wide bottom navigation
- [Form Controls](./guidelines/form-controls.md): inputs, selects, checkboxes, radio buttons, login forms, sign-up forms, checkout forms, search bars, newsletter sign-up fields, and input + button combos
- [General](./guidelines/general.md): general markup rules (class placement on block vs inline elements, redundant display classes, `role="list"`) and Tailwind CSS authoring rules (utility preferences, spacing conventions, arbitrary value syntax, variant patterns, deprecated utilities) that apply across all components
- [Headers](./guidelines/headers.md): site headers, navigation bars, navbars, top bars, logos, mobile menus, and hamburger menus
- [Heading Groups](./guidelines/heading-groups.md): the headline, subheadline, and optional eyebrow at the top of marketing and landing page sections (hero, features, team, pricing, CTA, etc.); does not apply to blog posts, articles, or editorial content
- [Icons](./guidelines/icons.md): SVG icons, icon sizing, icon alignment with text, Heroicons, filled vs stroked icons, and inline list icons like checkmarks
- [Images](./guidelines/images.md): photos, thumbnails, screenshots, app UI mockups, and image borders/outlines
- [Interactivity](./guidelines/interactivity.md): hover states, transitions, animations, and interactive behavior on clickable vs non-clickable elements
- [Landing Pages](./guidelines/landing-pages.md): full page consistency rules for buttons, fonts, containers, border radius, column gaps, layout alignment, and responsive constraints across all sections on a page
- [Login Pages](./guidelines/login-pages.md): login, sign-in, sign-up, and authentication page backgrounds and layout rules
- [Logo Clouds](./guidelines/logo-clouds.md): logo grids, client logo rows, partner logos, trust bars, and any section displaying a collection of brand logos
- [Navigation](./guidelines/navigation.md): sidebar nav, header nav, mobile nav menus, tabs, tab bars, vertical menus, active/selected states, and current page indicators in any navigation pattern
- [Pagination](./guidelines/pagination.md): page number links, previous/next buttons, and paged navigation controls
- [Placeholder Content](./guidelines/placeholder-content.md): dummy logos, placeholder avatars, app screenshots, wallpapers, and the assets API for generating realistic placeholder content
- [Prose Content](./guidelines/prose-content.md): styling raw HTML from markdown, CMS, or database content where Tailwind classes can't be applied to individual elements; replaces the `@tailwindcss/typography` plugin with a custom `.prose` class
- [Pricing Cards](./guidelines/pricing-cards.md): pricing tiers, pricing tables, plan cards, emphasized/popular plan styling, and button alignment across pricing columns
- [Responsive Design](./guidelines/responsive-design.md): responsive breakpoints, container queries, `@container` placement, and mobile-to-desktop layout adaptation
- [SVG](./guidelines/svg.md): inline SVG elements, `xmlns` attributes, SVG color styling (`fill`, `stroke`, `currentColor`), and SVG markup conventions used anywhere in HTML/JSX
- [Section Layout](./guidelines/section-layout.md): left-aligned vs centered section layouts, content width constraints, and aligning containers across stacked page sections
- [Shadows](./guidelines/shadows.md): box shadows on cards, modals, popovers, dropdowns, and elevated elements, including border pairing rules
- [Surfaces](./guidelines/surfaces.md): cards, wells, borders, dividers, and white space as surface treatments; when to use cards vs subtle dividers vs recessed backgrounds vs no separation at all; applies to stat grids, dashboard metrics, list items, sidebars, and any content grouping decision
- [Tables](./guidelines/tables.md): data tables, comparison tables, table headings, row dividers, and table containers
- [Team Sections](./guidelines/team-sections.md): team grids, team member cards, staff listings, about-us sections, and people galleries with photos and bios
- [Testimonials](./guidelines/testimonials.md): customer quotes, reviews, social proof sections, testimonial cards, hanging punctuation, and attribution layout
- [Typography](./guidelines/typography.md): font weights, line heights, text sizes, heading styles, max-width constraints, text-pretty/text-balance, tracking, and eyebrow text

## Reference Modules

Load these only when the request needs the reference:

- [Assets API](./guidelines/assets-api.md): placeholder asset URLs, query parameters, and examples for marks, avatars, logos, screenshots, and wallpapers
- [Font Recommendations](./guidelines/font-recommendations.md): optional font suggestions for when the user asks for help choosing a font or wants to try different fonts across design variations; includes sourcing notes, feature settings, and tips for each font

## Design Conflicts

When a rule says **⚠️ ask-user**, the user's input conflicts with a design guideline. Do not silently override the user or silently follow their request. Instead:

1. Use the `AskUserQuestion` tool to flag the conflict
2. Explain what the guideline recommends and why the input doesn't fit
3. Offer a concrete alternative (e.g. a rewritten version of their copy, a different layout)
4. Wait for the user to choose before proceeding

Never skip this, even if it feels minor. The user should always be aware when their input bumps up against a design rule.
