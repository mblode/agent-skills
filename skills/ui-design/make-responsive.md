# Make Responsive

Use when adapting an existing desktop-oriented UI to work across mobile, tablet, and desktop breakpoints.

## Workflow

1. Inspect the desktop layout; flag overflow, wrapping, clipping, cramped areas, desktop-only navigation, tables, forms, pagination, stat grids, and divider-separated layouts.
2. Apply mobile-first responsive classes and breakpoint-specific layout changes.
3. Prefer component-level responsiveness (container queries) when layout depends on available component space, not the viewport.
4. Check mobile, tablet, and desktop viewports.

## Responsive Design Rules

Audit order: page shell, navigation, text/forms, overflow, then component-specific patterns.

### Page Shell and Breakpoints

- Every layout adapts mobile to desktop via breakpoint classes (`sm:`, `md:`, `lg:`, etc.) for grid columns, spacing, font sizes, and visibility
- Multi-column desktop layouts (sidebars, secondary navigation, filter panels) collapse to single-column on small screens: use a mobile menu/disclosure, never shrink columns
- Use `min-h-dvh`, `min-h-svh`, or `min-h-lvh`; never `min-h-screen`

### Navigation and Pagination

- Every app needs a mobile nav menu below `lg`, whether desktop nav is header or sidebar: dialog or disclosure panel with a hamburger toggle; hide header nav with `hidden lg:flex`, sidebar nav with `hidden lg:block`, and the mobile toggle/menu with `lg:hidden`
- Horizontal menus (tabs, tab bars, pill navs) never overflow their parent: horizontal-scroll when items don't fit
- Hide page numbers on mobile when pagination has both numbers and previous/next buttons

### Text, Forms, and Touch Targets

- Subheadings, form controls, and icons are **larger on mobile**, scaling down at `sm:`: write the mobile (larger) size as default and the desktop (smaller) size with `sm:` (e.g. `text-2xl/8 sm:text-xl/8`, `text-lg/6 sm:text-sm/6`, `size-5 sm:size-4`, `py-2.5 sm:py-1.5`). Applies to subheadings, stat values, form input labels, badges, buttons, select/input padding, and icons. It does **not** apply to h1s (page titles stay the same or get smaller on mobile, never bigger) or to reading copy (next rule)
- Body, paragraph, and general page content stays `text-base` (16px) at every breakpoint, per [Typography](./guidelines/typography.md), which owns body size. Desktop reading distance is longer than mobile, so stepping body copy down to `text-sm` at `sm:` makes it harder to read, not denser
- Text input with font size below `16px`: add `max-sm:text-base/{lh}` to bump it to `16px` on mobile
- Checkboxes, radios, and toggles larger on mobile, scaling at `sm:`: e.g. `size-5 sm:size-4` for checkboxes/radios and `w-11 sm:w-9` for toggles
- Small/icon buttons need their touch target expanded on coarse pointers: see [Buttons](./guidelines/buttons.md), which owns the size and the expander markup
- Never fix cramped heading groups by constraining the wrapper with `max-w-*` or `max-lg:max-w-*`: constrain each text element directly with `max-w-[*ch]`

### Overflow and Flexible Sizing

- Add `min-w-0` to flex children that must shrink below their content size: fluid content beside fixed sidebars, truncated labels, flexible inputs beside fixed buttons
- Add `shrink-0` to flex children that must not compress: icons, SVGs, images, logos, avatars, fixed-size controls
- Make tables horizontally scroll when columns won't fit: wrap the table in an outer `overflow-x-auto whitespace-nowrap` div with matching negative container margins and an inner `inline-block min-w-full align-middle` div with matching horizontal padding
- Never let table headings wrap: add `whitespace-nowrap` to `<th>` elements

### Component Patterns

- Use container queries (`@container`) for component-level responsiveness: anything whose layout depends on available space rather than the viewport (dashboard widgets, feature cards, pricing tiers, testimonial grids)
- Place the `@container` element as close to the responsive content as possible: ideally a direct wrapper around the items, never a page-level container
- Use container queries (not media queries) for responsive dashboard widgets; truncate stat and metric card titles so they never wrap
- Reconfigure divider-separated grids at each breakpoint where columns change: reset first/last item padding, remove vertical dividers when collapsing to one column, and add horizontal dividers between rows
- Keep wrapped logo clouds balanced on every breakpoint: use a grid/layout that avoids uneven final rows like `5+1`
- Apply pricing-card emphasis with breakpoint-scoped grid rows and columns; let pricing cards stack normally below that breakpoint
- Use `min()` with viewport units for image and screenshot border radii instead of fixed `rounded-*`: e.g. `rounded-[min(1vw,12px)]`

## Verify

- UI works at narrow, medium, and desktop widths.
- Mobile navigation exists; desktop navigation hidden below `lg`.
- Tables, tabs, pagination, form controls, stat grids, and divider-separated grids behave on narrow screens.
