# Components

House rules per component. Load the sections for the elements actually in the request: a dashboard card or list item also loads Surfaces in `foundations.md`.

## Contents

- Buttons
- Icons
- Images
- SVG
- Avatars
- Badges
- Description Lists
- Tables
- Navigation
- Pagination
- Dashboards

## Buttons

Covers: primary/secondary buttons, CTAs, icon buttons, destructive actions, form actions, touch targets.

### Design Rules

- Button shadows follow `shadows.md`: never pair `shadow-*` with solid gray borders; use `ring-1 ring-black/5` or `ring-1 ring-black/10` instead
- Primary buttons with a ring: never use reduced ring opacity; use a solid color matching the button background (e.g. `ring-indigo-600` on a `bg-indigo-600` button, not `ring-black/10`)
- Dangerous actions (e.g. "Delete") use a secondary/muted style by default: only use a primary style when the dangerous action is the page's or dialog's primary action (e.g. a confirm-delete dialog)
- Only one primary button per page: scan the whole page and ensure only one uses a filled/solid primary style; every other must use secondary, soft/muted (solid with opacity), outline, or ghost (text-only); treat dialogs/modals as their own page
- Never make a secondary button higher contrast than the primary: the primary must always be the most visually prominent
- Any button that is not the page's primary submit/save action is an inline form action (change avatar, change photo, upload file, generate password, verify email, add item, resend code, etc.): always use the smaller of the two button sizes and a secondary style; never the same height as the form's primary/submit button
- Choice buttons, presets, segmented controls, and toggle buttons need a persistent selected state. Hover is not selection: the selected state stays unmistakable once the pointer leaves. Use `aria-pressed` on a toggle button, `role="radio"` with `aria-checked` inside a `radiogroup` for a single-choice preset set, and `aria-selected` only on the roles that accept it (`option`, `tab`, `row`, `gridcell`, `treeitem`). `aria-selected` on a plain `<button>` is invalid.

#### Sizing

- Less horizontal padding: `px-3 py-2` not `px-4 py-2`, `px-4 py-3` not `px-5 py-3`
- Application UIs (dashboards, settings, admin): `text-sm` with compact padding, never `text-base`; total rendered button height (including outer wrapper/ring) must stay within 28-38px; account for the `p-px` border wrapper (adds 2px total)
- Maximum 2 button sizes per application UI: pick two distinct heights and use only those; the difference must be at least 6px
- Buttons with a leading/trailing icon: never use symmetric `px-*`; use `pl-*`/`pr-*` and set the icon side's padding equal to the vertical padding: `py-2 pr-3 pl-2` (left icon), `py-2 pr-2 pl-3` (right icon), `py-1.5 pr-2.5 pl-1.5` (left icon, compact)

#### Focus Styles

- Solid buttons need a custom focus ring: `focus-visible:outline-*` with `focus-visible:outline-offset-2`; default to `focus-visible:outline-blue-500` if the project has no established focus color

### Coding Rules

- Small/icon buttons ship at a 48x48px touch target: make the button `relative` and add `<span class="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden" aria-hidden="true" />` as a direct child. This file owns the 48px build default. It sits deliberately above the 44x44 WCAG 2.5.5 floor that `rules/interaction-target-size.md` audits to, so a later padding change cannot drop the control under conformance
- Interactive labels: apply `select-none` (or `user-select: none`) on button and control inner text so drag-select does not fight clicks. Do not disable selection on body copy or inputs.

## Icons

Covers: SVG icons, Heroicons, inline checkmarks, icon buttons, icon sizing, icon alignment with text.

### Design Rules

- Never generate raw SVG icons: import from the project's icon library, or Heroicons if none is established.
- Never wrap icons in decorative containers (colored squares, circles with backgrounds): use the icon directly.
- Never scale icons: `viewBox="0 0 24 24"` uses `size-6`, `viewBox="0 0 20 20"` uses `size-5`, `viewBox="0 0 16 16"` uses `size-4`. If an icon looks too small, switch icon sets, don't bump the size class.
- Use 16px/micro icons (`size-4`) inline with `text-sm` text (checklists, feature items, comparison tables, inline labels); use 20px/mini (`size-5`) only for navigation list icons.
- Aligning an icon next to a text group (label + supporting text): align it to the first line/label with `items-start` or `items-baseline`, never `items-center` on the group.
- Application UIs (dashboards, settings, admin, sidebar nav, forms): use only Heroicons Micro (16px, `size-4`); never 20px/mini or 24px/outline.
- Icons paired with text should usually be visually quieter than the label: lower opacity, use the secondary text color, or reduce emphasis so the icon supports recognition without becoming the focal point.
- With a stroke-based icon set (Lucide, Tabler), match stroke to the adjacent text weight: `1.5px` beside regular (400) text, `2px` beside medium/semibold (500-600), `2.5px` beside bold (700). A hairline icon beside a bold label reads as broken. One stroke weight per surface; never mix icon libraries on one toolbar.
- Optically center asymmetric icons in icon-only buttons. If geometry looks off, adjust the SVG viewBox or wrapper alignment rather than trusting mathematical centering.

### Coding Rules

- Use `size-{n} h-lh` on SVG icons to vertically center them with adjacent text; set `font-size` on a wrapper instead of top margins or manual alignment.
- Use `fill-{color}` for filled icons and `stroke-{color}` for stroked icons; never `text-{color}` with `currentColor` (legacy v2 hack).
- Always add `shrink-0` to icons inside flex containers.

## Images

Covers: photos, thumbnails, screenshots, app mockups, product images, media frames, and image borders/outlines.

### Design Rules

- Never border photos or thumbnails: use `outline-1 -outline-offset-1 outline-black/5` or `outline-black/10` if a visible edge is needed
- For screenshots and app UI mockups: `outline-1 -outline-offset-1 outline-black/5` or `outline-black/10` on light surfaces, `outline-white/10` on dark
- When the screenshot is proof people must inspect, keep it straight-on, legible, and large enough to read. Avoid perspective, depth-of-field, aggressive crops, and fake device or browser chrome that obscure product detail.
- Put the shadow and outline on the same element that clips, not on a child of it. A rounded `overflow-hidden` parent clips its descendants, so a child carrying `shadow-*` loses the shadow at the corners; the clipping element's own outline and shadow are never clipped.

### Coding Rules

- Use `alt=""` when adjacent visible text identifies the subject

## SVG

Covers: inline SVG, SVG color styling, `fill`, `stroke`, `currentColor`, and SVG markup conventions.

- Omit `xmlns` on inline `<svg>` in HTML/JSX: only needed for standalone `.svg` files
- Style SVG colors with Tailwind classes (`fill-*`, `stroke-*`, `text-*` with `fill="currentColor"`/`stroke="currentColor"`), not hardcoded attributes or ternaries: use `data-*`/`aria-*` variants or conditional classes to switch colors
- Never combine `fill="currentColor"`/`stroke="currentColor"` attributes with `fill-*`/`stroke-*` classes on one element (they conflict): use `fill-current`/`stroke-current` to inherit text color, or drop the attribute when using a specific class like `fill-zinc-400`

## Avatars

Covers: profile photos, user thumbnails, testimonial people, comments, team members, overlapping groups.

- Avatar URLs and query parameters: `assets.md`
- Prefer extension-suffixed avatar URLs like `/avatars/1.webp`
- `outline-1 -outline-offset-1 outline-black/5` or `outline-black/10` on light surfaces; `outline-white/10` on dark surfaces
- Give stacked/overlapping groups a 2px `ring` matching the background (e.g. `ring-2 ring-white`)

## Badges

Covers: badges, tags, pills, labels, chips, status indicators, and compact metadata with icons.

- Badges with a leading/trailing icon: never use symmetric `px-*`; use `pl-*`/`pr-*` with the icon side's padding equal to the vertical padding: `py-1 pr-2 pl-1` (left icon), `py-1 pr-1 pl-2` (right icon)

## Description Lists

Covers: `<dl>`, `<dt>`, and `<dd>` content, term/detail pairs, metadata groups, and definition-style lists.

- Style `<dt>` with higher-contrast text and slightly heavier weight (e.g. `font-medium`); style `<dd>` with regular weight and lower-contrast color, so links inside `<dd>` use the higher-contrast color to stand out

## Tables

Covers: data tables, comparison tables, table headings, row dividers, horizontal scrolling tables, table containers.

### Design Rules

- Never use uppercase in table headings: use sentence case.
- Never let table headings wrap: add `whitespace-nowrap` to `<th>`.
- In dense work surfaces, default to tables directly on the page with row dividers. Use a bounded shell when search, filters, the table, page size, and pagination form one module, or when the project already does.
- Divide rows with horizontal lines only: no vertical lines, no outer borders.
- Always use `w-full` so tables fill their container.
- Hide headings with `sr-only` when column content is self-explanatory (typically 2-3 column tables where headings add no value).
- Make tables responsive when all columns won't fit on small screens, using a two-div wrapper:
  - Outer div: `overflow-x-auto whitespace-nowrap` with negative margins: horizontal margins cancel the page container's padding (e.g. `-mx-4 sm:-mx-6 lg:-mx-8`), vertical margin always `-my-2`.
  - Inner div: `inline-block min-w-full align-middle` with horizontal padding matching the container's (e.g. `px-4 sm:px-6 lg:px-8`) and `py-2`.
  - Always match the negative horizontal margins and horizontal padding to the container padding actually used in the page layout.

  ```html
  <!-- Example assumes container padding of px-4 sm:px-6 lg:px-8 -->
  <div class="-mx-4 -my-2 overflow-x-auto whitespace-nowrap sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full px-4 py-2 align-middle sm:px-6 lg:px-8">
      <table>
        …
      </table>
    </div>
  </div>
  ```

## Navigation

Covers: sidebar nav, header nav, mobile menus, tabs, tab bars, vertical menus, active states, current-page indicators.

- Give every app a mobile nav menu on small screens, whether the desktop nav is a header or sidebar: use a dialog or disclosure panel with a hamburger toggle; hide the desktop nav with `hidden lg:flex` (header) or `hidden lg:block` (sidebar) and show the mobile menu below `lg:`.
- Never use a high-contrast or primary-color background for active nav items: use darker text, a soft/muted background, or both.
- Never change `font-weight` between nav states (default, hover, active): use color and background only.
- Never let horizontal menus (tabs, tab bars, pill navs) overflow the parent: scroll horizontally when items don't fit.
- Never use icons in top header horizontal nav links: text-only.
- To center nav links on the page (not just between side items), use a three-section flex layout: `<div class="flex flex-1 items-center">` for the left (logo), the nav links at natural width (no `flex-1`), and `<div class="flex flex-1 items-center justify-end">` for the right (actions). The matching `flex-1` gutters force the centered group to true page center. Use the same pattern to center a logo: keep it at natural width with `flex-1` on the side sections.

## Pagination

Covers: pagination, page number links, previous/next buttons, and paged navigation controls.

- Hide page numbers on mobile when pagination includes both page numbers and previous/next buttons

## Dashboards

Covers: layouts, stat grids, KPI cards, metric cards, admin panels, analytics views, summary data.

### Design Rules

- Never let stat/metric card titles wrap; use `truncate` to keep them on one line
- Never put icons in stat/metric cards: use plain text labels and values only

### Coding Rules

- Use container queries (not media queries) for responsive dashboard widgets
