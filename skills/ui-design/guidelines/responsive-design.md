# Responsive Design

Covers: mobile, tablet, desktop, breakpoints, container queries, overflow, wrapping, clipping, cramped narrow viewports. For the full retrofit ruleset (navigation, tables, pagination, touch targets, overflow patterns), see [../make-responsive.md](../make-responsive.md).

## Design Rules

- Adapt every layout mobile to desktop with breakpoint classes (`sm:`, `md:`, `lg:`): adjust grid columns, spacing, font sizes, and visibility.
- Collapse multi-column desktop layouts (sidebars, secondary nav, filter panels) to single column on small screens via mobile menu, disclosure, or compact pattern; never just shrink columns.
- Make body text, subheadings, form controls, and icons **larger on mobile**, smaller at `sm:`: write the mobile (larger) size as default and the desktop (smaller) size with `sm:` (e.g. `text-2xl/8 sm:text-xl/8`, `text-base/7 sm:text-sm/6`, `text-lg/6 sm:text-sm/6`, `size-5 sm:size-4`, `py-2.5 sm:py-1.5`). Applies to body text, subheadings, stat values, form input labels, badges, buttons, select/input padding, and icons. **Not** h1s (page titles stay equal or get smaller on mobile, never bigger).
- Keep body text at least `text-base` (16px) on mobile; `text-sm` only at `sm:` or larger (e.g. `text-base/7 sm:text-sm/6`, never `text-sm/6` unprefixed for body copy).

## Coding Rules

- Use container queries (`@container`) for component-level responsiveness: anything whose layout depends on available space, not the viewport (dashboard widgets, feature cards, pricing tiers, testimonial grids).
- Place the `@container` element as close to the responsive content as possible: a direct wrapper around the items, never a page-level container.
