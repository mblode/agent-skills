# Craft Checklist (Detailed)

Use this as a final polish pass.

## Legibility and typography
- Use correct punctuation (quotes, apostrophes, dashes); use `&hellip;` for ellipsis.
- Keep sentence case; avoid underlines except links.
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
- Validate against `animation-guidelines` (timing, easing, reduced motion, transform/opacity only).

## Keyboard, focus, and targets
- Provide full keyboard support and visible focus styles.
- Manage focus in dialogs/menus (trap, restore).
- Hit targets >= 24px (>= 44px on mobile); if the visual target is smaller, expand the hit area.
- Gate hover styles with `@media (hover: hover)`.
- Never disable browser zoom (`user-scalable=no` / `maximum-scale=1`).
- Use `touch-action: manipulation` on tap targets to prevent double-tap zoom.
- Disable pointer events on decorative layers (glows, gradients).
- If it looks clickable, it must be clickable; remove dead zones between items.
- Avoid text selection during drag; use `inert` or disable selection where needed.

## Forms and input behavior
- Label inputs; Enter submits; textarea uses Cmd/Ctrl+Enter.
- Inputs must be hydration-safe (no lost focus/value after hydration).
- Use correct `type`, `name`, `autocomplete`, and `inputmode`.
- Disable spellcheck for emails/codes/usernames; avoid input names that trigger password managers when not needed.
- Mobile input font size >= 16px; avoid autofocus on touch devices.
- Do not block paste or typing; validate after input.
- Show inline errors; focus the first error on submit.
- Allow incomplete submission to surface validation; keep submit enabled until request starts, then disable with spinner and keep the original label.
- Trim trailing whitespace from IME/text expansion to avoid false errors.
- Ensure password managers and one-time codes work.

## Navigation and feedback
- Use `<a>`/`<Link>` for navigation; preserve URL state; Back/Forward restores scroll.
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
- Preload above-the-fold images and critical fonts; set explicit image dimensions.
- Virtualize large lists.
- Minimize re-renders; profile when needed.
- Use `will-change` sparingly; avoid heavy blur and excessive video autoplay.

## Accessibility and theming
- Prefer native semantics before ARIA.
- Add `aria-label` to icon-only controls; mark decorative elements `aria-hidden`.
- Do not attach tooltips to disabled controls; hover-tooltips should not contain interactive content.
- Use `<img>` for images; HTML illustrations need an accessible name.
- Provide redundant status cues (not color-only).
- Provide skip link and heading hierarchy.
- Do not animate during theme switches; set `color-scheme` and `<meta name="theme-color">`.
- Guard hydration for date/time; `value` inputs require `onChange`.

## Extra polish
- Match box-shadows and motion to high-quality references.
- Add SEO metadata and dynamic OG images.
- Add keyboard shortcuts where useful.

## Resources
- Devouring Details, Sanding UI, Paul Graham on Taste, Typewolf checklist.
