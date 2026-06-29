# Navigation

Covers: sidebar nav, header nav, mobile menus, tabs, tab bars, vertical menus, active states, current-page indicators.

- Give every app a mobile nav menu on small screens, whether the desktop nav is a header or sidebar: use a dialog or disclosure panel with a hamburger toggle; hide the desktop nav with `hidden lg:flex` (header) or `hidden lg:block` (sidebar) and show the mobile menu below `lg:`.
- Never use a high-contrast or primary-color background for active nav items: use darker text, a soft/muted background, or both.
- Never change `font-weight` between nav states (default, hover, active): use color and background only.
- Never let horizontal menus (tabs, tab bars, pill navs) overflow the parent: scroll horizontally when items don't fit.
- Never use icons in top header horizontal nav links: text-only.
- To center nav links on the page (not just between side items), use a three-section flex layout: `<div class="flex flex-1 items-center">` for the left (logo), the nav links at natural width (no `flex-1`), and `<div class="flex flex-1 items-center justify-end">` for the right (actions). The matching `flex-1` gutters force the centered group to true page center. Use the same pattern to center a logo: keep it at natural width with `flex-1` on the side sections.
