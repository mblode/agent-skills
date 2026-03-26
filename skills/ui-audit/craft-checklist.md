# Craft Checklist (Detailed)

Use this as a final polish pass.

## Contents
- Legibility and typography
- Motion
- Keyboard, focus, and targets
- Forms and input behaviour
- Navigation and feedback
- Resilience and layout
- Performance
- Accessibility and theming
- Extra polish
- Content and copy
- Anti-patterns (flag these)
- Resources

## Legibility and typography
- Use correct punctuation (quotes, apostrophes, dashes); use `&hellip;` for ellipsis.
- Keep sentence case; avoid underlines except links.
- Use British/Australian spelling in user-facing copy.
- Body size: 18-24px desktop, 14-19px mobile; line length 45-75 chars; line-height ~1.45.
- Avoid letter-spacing on body; add slight tracking to all-caps and small labels.
- Limit to <= 2 typefaces; weights >= 400; use `clamp()` for fluid sizes.
- Use `font-variant-numeric: tabular-nums` for data; use monospaced or tabular numbers in tables.
- Prevent widows/orphans; use `text-wrap: balance` or non-breaking spaces.
- Use non-breaking spaces for glued terms (10&nbsp;MB, Cmd&nbsp;+&nbsp;K, brand names).
- Avoid pure black/white; improve contrast for links and text-on-images.
- Avoid link hover effects that shift layout (no font-weight or size changes).
- Enable `-webkit-font-smoothing` and `text-rendering: optimizeLegibility`.

## Motion
- Validate against `ui-animation` (timing, easing, transform/opacity only).

## Keyboard, focus, and targets
- Provide full keyboard support and visible focus styles.
- Manage focus in dialogs/menus (trap, restore).
- Hit targets >= 24px (>= 44px on mobile); if the visual target is smaller, expand the hit area.
- Gate hover styles with `@media (hover: hover)`.
- Never disable browser zoom (`user-scalable=no` / `maximum-scale=1`).
- Use `touch-action: manipulation` on tap targets to prevent double-tap zoom.
- Never `outline: none` / `outline-none` without a `:focus-visible` replacement.
- Buttons/links need a `hover:` state; hover/active/focus should be more prominent than rest state.
- `scroll-margin-top` on heading anchors for in-page links.
- Set `-webkit-tap-highlight-color` intentionally on tap targets.
- `autoFocus` sparingly — desktop only, single primary input; avoid on mobile.
- Disable pointer events on decorative layers (glows, gradients).
- If it looks clickable, it must be clickable; remove dead zones between items.
- Avoid text selection during drag; use `inert` or disable selection where needed.

## Forms and input behaviour
- Label inputs; Enter submits; textarea uses Cmd/Ctrl+Enter.
- Inputs must be hydration-safe (no lost focus/value after hydration).
- Use correct `type`, `name`, `autocomplete`, and `inputmode`.
- Disable spellcheck for emails/codes/usernames; avoid input names that trigger password managers when not needed.
- Mobile input font size >= 16px; avoid autofocus on touch devices.
- Do not block paste or typing; validate after input.
- Show inline errors; focus the first error on submit.
- Allow incomplete submission to surface validation; keep submit enabled until request starts, then disable with spinner and keep the original label.
- Checkboxes/radios: label + control share a single hit target (no dead zones).
- Placeholders end with `…` and show an example pattern.
- `autocomplete="off"` on non-auth fields to avoid password-manager triggers.
- Trim trailing whitespace from IME/text expansion to avoid false errors.
- Ensure password managers and one-time codes work.
- Warn before navigation with unsaved changes (`beforeunload` or router guard).

## Navigation and feedback
- Use `<a>`/`<Link>` for navigation; preserve URL state; Back/Forward restores scroll.
- Supporting chrome should recede beneath the current task; sidebars, tabs, and secondary bars must be quieter than the main content.
- Shared header actions should stay in consistent slots across comparable screens.
- Prefer compact tab groups over full-width bars when they communicate the same state.
- Confirm destructive actions or provide undo.
- Use polite `aria-live` for toasts/validation.
- Add a short show-delay (150-300ms) and minimum duration (300-500ms) for spinners/skeletons to avoid flicker.
- Use ellipsis for follow-ups and loading states (Rename&hellip;, Loading&hellip;).
- Provide designed empty, loading, and error states.

## Resilience and layout
- Use flex/grid; avoid JS measurement.
- Respect safe areas and prevent unwanted scrollbars.
- Use `overscroll-behavior: contain` in modals/drawers.
- Ensure text truncation (`min-w-0`, `line-clamp`, `break-words`) and long content support.
- Design for empty/sparse/dense states.
- Use locale-aware formatting (`Intl.*`).

## Performance
- Above-fold critical images: `priority` or `fetchpriority="high"`; below-fold images: `loading="lazy"`.
- Set explicit `width` and `height` on images to prevent CLS.
- Critical fonts: `<link rel="preload" as="font">` with `font-display: swap`.
- Add `<link rel="preconnect">` for CDN/asset domains.
- Virtualize large lists (>50 items).
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`, etc.); batch DOM reads/writes.
- Minimise re-renders; profile when needed.
- Use `will-change` sparingly; avoid heavy blur and excessive video autoplay.

## Accessibility and theming
- Prefer native semantics before ARIA.
- Add `aria-label` to icon-only controls; mark decorative elements `aria-hidden`.
- Do not attach tooltips to disabled controls; hover-tooltips should not contain interactive content.
- Use `<img>` for images; HTML illustrations need an accessible name.
- Provide redundant status cues (not colour-only).
- Provide skip link and heading hierarchy.
- Do not animate during theme switches; set `color-scheme` and `<meta name="theme-color">`.
- Native `<select>`: set explicit `background-color` and `color` (Windows dark mode fix).
- Guard hydration for date/time; `value` inputs require `onChange`.
- `suppressHydrationWarning` only where truly needed (dates, theme).

## Extra polish
- Match box-shadows and motion to high-quality references.
- Remove redundant icons and coloured icon backgrounds when labels or grouping already carry the meaning.
- Every border and separator should justify itself; avoid stacked dividers and high-contrast grid noise.
- **Concentric border radius:** check that `outer-radius = inner-radius + padding` on nested elements (cards with inner panels, buttons with icon badges). Mismatched radii are the most common unnoticed visual error.
- **Optical alignment:** for icon+text buttons, use slightly less padding on the icon side. For icon-only buttons, verify the icon is optically centred — triangular and asymmetric shapes sit off-centre geometrically. Fix in the SVG first; use `margin` or `padding` adjustments if you can't change the SVG.
- **Image outlines:** images on white or near-white backgrounds benefit from `outline: 1px solid rgba(0,0,0,0.1); outline-offset: -1px` to anchor them to the layout. Add `.dark` variant with `rgba(255,255,255,0.1)`. Use `outline` not `border` to avoid layout shift.
- Add SEO metadata and dynamic OG images.
- Add keyboard shortcuts where useful.

## Content and copy
- Active voice: "Install the CLI" not "The CLI will be installed".
- Sentence case for headings and buttons.
- Numerals for counts: "8 deployments" not "eight".
- Specific button labels: "Save API Key" not "Continue".
- Error messages include fix/next step, not just the problem.
- Second person; avoid first person.
- `&` over "and" where space-constrained.

## Anti-patterns (flag these)
- `user-scalable=no` or `maximum-scale=1` disabling zoom.
- `onPaste` + `preventDefault`.
- `transition: all` — list properties explicitly.
- `outline-none` without `:focus-visible` replacement.
- `<div>` / `<span>` with click handlers instead of `<button>`.
- Inline `onClick` navigation without `<a>`.
- Images without `width`/`height` dimensions.
- Large arrays `.map()` without virtualization.
- Form inputs without labels.
- Icon buttons without `aria-label`.
- Hardcoded date/number formats (use `Intl.*`).
- `autoFocus` without clear justification.
- Navigation chrome that is as loud as the primary work surface.
- Headers or cards with stacked high-contrast borders that do not clarify meaning.

## Resources
- Devouring Details, Sanding UI, Paul Graham on Taste, Typewolf checklist.
