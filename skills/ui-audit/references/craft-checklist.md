# Craft Checklist (Detailed)

Final polish sweep for pre-release sign-off. Run after the rule-based CRITICAL/HIGH passes; catches built-UI defect details the rules layer doesn't encode. Scoped to defects in built React/Next UI. Visual direction, motion, SEO, and deep typography belong to sibling skills and are pointed to, not restated here.

## Contents
- Legibility and typography → sibling
- Keyboard, focus, and targets
- Forms and input behaviour
- Navigation and feedback
- Resilience and layout
- Performance
- Accessibility and theming
- Motion → sibling
- Visual direction and SEO → sibling

## Legibility and typography

Run `typography-checklist.md` for the punctuation, sizing, measure, and OpenType sweep; deep type (pairing, brand, display) is the `typography-audit` skill. Not duplicated here.

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
- Nested menus have a forgiving pointer corridor so moving diagonally into a submenu does not close it.
- Multi-key shortcuts tolerate release-order mistakes where the app owns the chord handling; don't cancel a chord the instant the first key lifts.
- Movable controls with natural stops (carousels, sliders, drawers) snap to valid positions after release, not halfway states.

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
- Preserve user position: filters, route changes, pagination, list updates, and Back/Forward keep scroll position or restore the equivalent item in view.
- Context menus open with stable action placement relative to the cursor, and never put a destructive action under the current cursor after the menu appears.
- Tooltips delay on first hover, but neighbouring tooltips in the same group switch instantly once the first tooltip is open.

## Resilience and layout
- Lay out with flex/grid (no JS measurement); respect safe areas; design for empty/sparse/dense.
- `overscroll-behavior: contain` in modals/drawers.
- Text truncation: `min-w-0`, `line-clamp`, `break-words`.
- Locale-aware formatting (`Intl.*`).
- Stress test with long labels, one-word values, dense rows, empty lists, and one-item lists. The UI should not only survive the populated demo state.
- Added or removed list rows preserve subjective position: content around the changed row should not jump unless the action is explicitly a reorder or navigation.
- If the same object appears across two views, preserve object permanence through the transition when practical: keep position, thumbnail, title, or shape continuous instead of replacing it with an unrelated hard cut.

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

## Motion → sibling

Timing, easing, springs, gestures, and transform/opacity-only animation belong to the `ui-animation` skill. Route motion findings there for the fix.

## Visual direction and SEO → sibling

- Visual-direction polish (matching box-shadows to references, concentric border radius, optical alignment of icons/text, image outlines on light backgrounds, the fundamentals→visual→polish quality pyramid) is the `ui-design` skill's job, not a built-UI defect check.
- SEO metadata, canonical/OG tags, and dynamic OG images belong to the `optimise-seo` skill.
