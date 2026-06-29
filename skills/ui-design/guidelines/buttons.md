# Buttons

Covers: primary/secondary buttons, CTAs, icon buttons, destructive actions, form actions, touch targets.

## Design Rules

- Button shadows follow `shadows.md`: never pair `shadow-*` with solid gray borders; use `ring-1 ring-black/5` or `ring-1 ring-black/10` instead
- Primary buttons with a ring: never use reduced ring opacity; use a solid color matching the button background (e.g. `ring-indigo-600` on a `bg-indigo-600` button, not `ring-black/10`)
- Dangerous actions (e.g. "Delete") use a secondary/muted style by default: only use a primary style when the dangerous action is the page's or dialog's primary action (e.g. a confirm-delete dialog)
- Only one primary button per page: scan the whole page and ensure only one uses a filled/solid primary style; every other must use secondary, soft/muted (solid with opacity), outline, or ghost (text-only); treat dialogs/modals as their own page
- Never make a secondary button higher contrast than the primary: the primary must always be the most visually prominent
- Any button that is not the page's primary submit/save action is an inline form action (change avatar, change photo, upload file, generate password, verify email, add item, resend code, etc.): always use the smaller of the two button sizes and a secondary style; never the same height as the form's primary/submit button

### Sizing

- Less horizontal padding: `px-3 py-2` not `px-4 py-2`, `px-4 py-3` not `px-5 py-3`
- Application UIs (dashboards, settings, admin): `text-sm` with compact padding, never `text-base`; total rendered button height (including outer wrapper/ring) must stay within 28-38px; account for the `p-px` border wrapper (adds 2px total)
- Maximum 2 button sizes per application UI: pick two distinct heights and use only those; the difference must be at least 6px
- Buttons with a leading/trailing icon: never use symmetric `px-*`; use `pl-*`/`pr-*` and set the icon side's padding equal to the vertical padding: `py-2 pr-3 pl-2` (left icon), `py-2 pr-2 pl-3` (right icon), `py-1.5 pr-2.5 pl-1.5` (left icon, compact)

### Focus Styles

- Solid buttons need a custom focus ring: `focus-visible:outline-*` with `focus-visible:outline-offset-2`; default to `focus-visible:outline-blue-500` if the project has no established focus color

## Coding Rules

- Small/icon buttons must meet the 48×48px minimum touch target: make the button `relative` and add `<span class="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden" aria-hidden="true" />` as a direct child
