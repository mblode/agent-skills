# Craft Checklist (Detailed)

Final polish sweep for pre-release sign-off. Run after the rule-based CRITICAL/HIGH passes; catches craft details the rules layer doesn't encode (chrome hierarchy, optical alignment, concentric radii, hover affordances).

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
- Resources

## Legibility and typography
- Full punctuation, sizing, measure, OpenType sweep: run `typography-checklist.md`, don't duplicate. Spot-checks unique here:
  - British/Australian spelling in user-facing copy.
  - <= 2 typefaces; weights >= 400; `clamp()` for fluid sizes.
  - `font-variant-numeric: tabular-nums` on data and tables.
  - `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility`.

## Motion
- Validate against the `ui-animation` skill (timing, easing, transform/opacity only).

## Keyboard, focus, and targets
- Full keyboard support and visible focus; trap/restore focus in dialogs and menus.
- Hit targets >= 24px (>= 44px mobile); expand the hit area when the visual target is smaller.
- Never `outline: none` / `outline-none` without a `:focus-visible` replacement.
- Buttons/links need a `hover:` state; hover/active/focus more prominent than rest. Gate hover with `@media (hover: hover)`.
- Never disable browser zoom (`user-scalable=no` / `maximum-scale=1`); `touch-action: manipulation` on tap targets (no double-tap zoom); set `-webkit-tap-highlight-color` intentionally.
- `scroll-margin-top` on heading anchors for in-page links.
- `autoFocus` sparingly: desktop only, single primary input; avoid on mobile.
- Decorative layers (glows, gradients) get `pointer-events: none`.
- If it looks clickable, it must be clickable; remove dead zones between items. Avoid text selection during drag (`inert` or disable selection).

## Forms and input behaviour
- Label inputs; Enter submits; textarea uses Cmd/Ctrl+Enter. Correct `type`, `name`, `autocomplete`, `inputmode`.
- Hydration-safe (no lost focus/value after hydration).
- Mobile input font size >= 16px; avoid autofocus on touch.
- Disable spellcheck for emails/codes/usernames; `autocomplete="off"` on non-auth fields to avoid password-manager triggers; keep password managers and one-time codes working.
- Don't block paste or typing; validate after input. Trim trailing whitespace from IME/text expansion.
- Show inline errors; focus the first error on submit. Allow incomplete submission to surface validation; keep submit enabled until the request starts, then disable with a spinner and keep the original label.
- Checkboxes/radios: label + control share one hit target (no dead zones).
- Placeholders end with `…` and show an example pattern.
- Warn before navigation with unsaved changes (`beforeunload` or router guard).

## Navigation and feedback
- Use `<a>`/`<Link>` for navigation; preserve URL state; Back/Forward restores scroll.
- Supporting chrome (sidebars, tabs, secondary bars) recedes beneath the current task; keep shared header actions in consistent slots across comparable screens; prefer compact tab groups over full-width bars at equal state.
- Confirm destructive actions or provide undo. Polite `aria-live` for toasts/validation.
- Spinners/skeletons: show-delay 150-300ms, min duration 300-500ms (avoid flicker).
- Ellipsis for follow-ups and loading states (Rename…, Loading…).
- Provide designed empty, loading, and error states.

## Resilience and layout
- Lay out with flex/grid (no JS measurement); respect safe areas; design for empty/sparse/dense.
- `overscroll-behavior: contain` in modals/drawers.
- Text truncation: `min-w-0`, `line-clamp`, `break-words`.
- Locale-aware formatting (`Intl.*`).

## Performance
- Above-fold images: `priority` / `fetchpriority="high"`; below-fold: `loading="lazy"`. Set explicit `width`/`height` (CLS).
- Critical fonts: `<link rel="preload" as="font">` + `font-display: swap`; `<link rel="preconnect">` for asset domains.
- Virtualize lists >50 items; no layout reads in render (`getBoundingClientRect`, `offsetHeight`); batch DOM reads/writes.
- `will-change` sparingly; avoid heavy blur and excessive video autoplay.

## Accessibility and theming
- Native semantics before ARIA. `aria-label` on icon-only controls; `aria-hidden` on decorative elements.
- No tooltips on disabled controls; hover-tooltips hold no interactive content.
- `<img>` for images; HTML illustrations need an accessible name. Redundant status cues (not colour-only). Skip link + heading hierarchy.
- No animation during theme switches; set `color-scheme` and `<meta name="theme-color">`. Native `<select>`: explicit `background-color` and `color` (Windows dark mode fix).
- Guard hydration for date/time; `value` inputs require `onChange`; `suppressHydrationWarning` only where needed (dates, theme).

## Extra polish
- Match box-shadows and motion to high-quality references.
- Remove redundant icons and coloured icon backgrounds when labels or grouping already carry the meaning. Every border/separator should justify itself; avoid stacked dividers and high-contrast grid noise.
- **Concentric border radius:** `outer-radius = inner-radius + padding` on nested elements (cards with inner panels, buttons with icon badges). Mismatched radii are the most common unnoticed visual error.
- **Optical alignment:** icon+text buttons use slightly less padding on the icon side. For icon-only buttons, optically centre the icon; triangular/asymmetric shapes sit off-centre geometrically. Fix in the SVG first, else `margin`/`padding` adjustments.
- **Image outlines:** images on white/near-white backgrounds get `outline: 1px solid rgba(0,0,0,0.1); outline-offset: -1px` to anchor them; `.dark` variant `rgba(255,255,255,0.1)`. Use `outline` not `border` (no layout shift).
- Add SEO metadata and dynamic OG images; keyboard shortcuts where useful.

## Resources
- Devouring Details, Sanding UI, Paul Graham on Taste, Typewolf checklist.
