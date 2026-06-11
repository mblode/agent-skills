# Make Responsive

Use this when the user wants an existing desktop-oriented UI to work well across mobile, tablet, and desktop breakpoints.

## Load First

- Responsive design guidance is inline below.

## Workflow

1. Inspect the current desktop layout and identify overflow, wrapping, clipping, cramped areas, desktop-only navigation, tables, forms, pagination, stat grids, and divider-separated layouts.
2. Apply mobile-first responsive classes and breakpoint-specific layout changes.
3. Prefer component-level responsiveness with container queries when layout depends on available component space.
4. Check mobile, tablet, and desktop viewports.

## Responsive Design Rules

Use these rule groups as an audit order: page shell first, navigation second, then text/forms, overflow, and component-specific patterns.

### Page Shell and Breakpoints

- Every layout must adapt from mobile to desktop: use responsive breakpoint classes (`sm:`, `md:`, `lg:`, etc.) to adjust grid columns, spacing, font sizes, and visibility at different screen sizes
- Multi-column desktop layouts (sidebars, secondary navigation, filter panels) must collapse to a single-column layout on small screens: use a mobile menu, disclosure, or other compact pattern instead of shrinking columns
- Use `min-h-dvh`, `min-h-svh`, or `min-h-lvh`; never use `min-h-screen`

### Navigation and Pagination

- Every app must have a mobile navigation menu below `lg`, regardless of whether the desktop nav is in a header or sidebar: use a dialog or disclosure panel with a hamburger toggle; hide header nav with `hidden lg:flex`, hide sidebar nav with `hidden lg:block`, and hide the mobile toggle/menu at desktop widths with `lg:hidden`
- Horizontal menus (tabs, tab bars, pill navs) must never overflow their parent: use horizontal scrolling when items do not fit
- Hide page numbers on mobile when pagination includes both page numbers and previous/next buttons

### Text, Forms, and Touch Targets

- Body text, subheadings, form controls, and icons should be **larger on mobile** and scale down at `sm:`: write the mobile (larger) size as the default and the desktop (smaller) size with `sm:` (e.g. `text-2xl/8 sm:text-xl/8`, `text-base/7 sm:text-sm/6`, `text-lg/6 sm:text-sm/6`, `size-5 sm:size-4`, `py-2.5 sm:py-1.5`); this applies to body text, subheadings, stat values, form input labels, badges, buttons, select/input padding, and icons, **not** h1s (page titles stay the same size or get smaller on mobile, not bigger)
- Body, paragraph, and general page content must be at least `text-base` (16px) on mobile: never use `text-xs`; `text-sm` is only acceptable at `sm:` or larger breakpoints (e.g. `text-base/7 sm:text-sm/6`, never `text-sm/6` without a breakpoint prefix for body copy)
- If a text input's font size is smaller than `16px`, add `max-sm:text-base/{lh}` to bump it to `16px` on mobile
- Checkboxes, radio buttons, and toggles should be larger on mobile and scale down at `sm:`: e.g. `size-5 sm:size-4` for checkboxes/radios and `w-11 sm:w-9` for toggles
- Small/icon buttons must meet the 48×48px minimum touch target: make the button `relative` and add a direct child `<span class="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden" aria-hidden="true" />` when the visual button is smaller
- Never fix cramped heading groups by constraining the wrapper with `max-w-*` or `max-lg:max-w-*`: constrain each text element directly with `max-w-[*ch]`

### Overflow and Flexible Sizing

- Always add `min-w-0` to flex children that must shrink below their content size, especially fluid content beside fixed sidebars, truncated labels, and flexible inputs beside fixed buttons
- Always add `shrink-0` to flex children that must not compress: icons, SVGs, images, logos, avatars, and fixed-size controls
- Always make tables horizontally scroll when all columns will not fit on smaller screens: wrap the table in an outer `overflow-x-auto whitespace-nowrap` div with matching negative container margins and an inner `inline-block min-w-full align-middle` div with matching horizontal padding
- Never let table headings wrap: add `whitespace-nowrap` to `<th>` elements

### Component Patterns

- Use container queries (`@container`) for component-level responsiveness: anything whose layout depends on available space rather than the viewport (e.g. dashboard widgets, feature cards, pricing tiers, testimonial grids)
- When using container queries, place the `@container` element as close to the responsive content as possible: ideally a direct wrapper around the items, never on a page-level container
- Use container queries for responsive dashboard widgets, not media queries; truncate stat and metric card titles so they never wrap
- Reconfigure divider-separated grids at each breakpoint where columns change: reset first/last item padding, remove vertical dividers when collapsing to one column, and add horizontal dividers between rows
- Keep wrapped logo clouds balanced on every breakpoint: use a grid or layout that avoids uneven final rows like `5+1`
- Apply pricing-card emphasis with breakpoint-scoped grid rows and columns, and let pricing cards stack normally below that breakpoint
- Use `min()` with viewport units for image and screenshot border radii instead of fixed `rounded-*` values: e.g. `rounded-[min(1vw,12px)]`

## Verify

- Confirm the UI works at narrow, medium, and desktop widths.
- Confirm mobile navigation exists and desktop navigation is hidden below `lg`.
- Confirm tables, tabs, pagination, form controls, stat grids, and divider-separated grids behave correctly on narrow screens.
