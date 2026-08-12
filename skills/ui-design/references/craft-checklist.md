# Craft Checklist (Detailed)

Final polish sweep for pre-release sign-off. Run after the rule-based CRITICAL/HIGH passes; it carries only the built-UI details no rule file encodes. Anything already owned by a rule (`rules/interaction-*`, `forms-*`, `a11y-*`, `nav-*`, `layout-*`, `perf-*`, `rules/states-*`, `dark-i18n-*`) is not repeated here, so a craft finding never duplicates a rule finding. Visual direction, motion, SEO, and deep typography belong to sibling skills and are pointed to, not restated.

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

Surface type defects are the `type-` rule; punctuation, OpenType, pairing, brand, and display type are the `typography-audit` skill. Not duplicated here.

## Keyboard, focus, and targets
- Buttons/links need a `hover:` state; hover/active/focus more prominent than rest. Set `-webkit-tap-highlight-color` on controls.
- `scroll-margin-top` on heading anchors for in-page links.
- `autoFocus` sparingly: desktop only, single primary input.
- Decorative layers (glows, gradients) get `pointer-events: none`.
- If it looks clickable, it must be clickable; remove dead zones between items. Avoid text selection during drag (`inert` or disable selection).
- Nested menus have a forgiving pointer corridor so moving diagonally into a submenu does not close it.
- Multi-key shortcuts tolerate release-order mistakes where the app owns the chord handling; don't cancel a chord the instant the first key lifts.
- Movable controls with natural stops (carousels, sliders, drawers) snap to valid positions after release, not halfway states.

## Forms and input behaviour
- Enter submits; textarea uses Cmd/Ctrl+Enter.
- Hydration-safe (no lost focus/value after hydration).
- Disable spellcheck for emails/codes/usernames; `autocomplete="off"` on non-auth fields to avoid password-manager triggers; keep password managers and one-time codes working.
- Allow incomplete submission to surface validation; keep submit enabled until the request starts, then disable with a spinner and keep the original label.
- Checkboxes/radios: label + control share one hit target (no dead zones).
- Placeholders end with `…` and show an example pattern.
- Warn before navigation with unsaved changes (`beforeunload` or router guard).

## Navigation and feedback
- Preserve URL state; Back/Forward restores scroll.
- Supporting chrome (sidebars, tabs, secondary bars) recedes beneath the current task; keep shared header actions in consistent slots across comparable screens; prefer compact tab groups over full-width bars at equal state.
- Confirm destructive actions or provide undo.
- Spinners/skeletons: show-delay 150-300ms, min duration 300-500ms (avoid flicker).
- Preserve user position: filters, route changes, pagination, list updates, and Back/Forward keep scroll position or restore the equivalent item in view.
- Context menus open with stable action placement relative to the cursor, and never put a destructive action under the current cursor after the menu appears.
- Tooltips delay on first hover, but neighbouring tooltips in the same group switch instantly once the first tooltip is open.

## Resilience and layout
- `overscroll-behavior: none` on `html` for app shells; `contain` in modals and drawers. Document sites keep pull-to-refresh.
- Stress test with long labels, one-word values, dense rows, empty lists, and one-item lists. The UI should not only survive the populated demo state.
- Added or removed list rows preserve subjective position: content around the changed row should not jump unless the action is explicitly a reorder or navigation.
- If the same object appears across two views, preserve object permanence through the transition when practical: keep position, thumbnail, title, or shape continuous instead of replacing it with an unrelated hard cut.

## Performance
- No layout reads in render (`getBoundingClientRect`, `offsetHeight`); batch DOM reads/writes.
- `will-change` sparingly; avoid heavy blur and excessive video autoplay.

## Accessibility and theming
- No tooltips on disabled controls; hover-tooltips hold no interactive content.
- HTML illustrations (inline SVG, CSS art) need an accessible name, same as `<img>`.
- No animation during theme switches; set `color-scheme` and `<meta name="theme-color">`. Native `<select>`: explicit `background-color` and `color` (Windows dark mode fix).
- Guard hydration for date/time; `value` inputs require `onChange`; `suppressHydrationWarning` only where needed (dates, theme).

## Motion → sibling

Timing, easing, springs, gestures, and transform/opacity-only animation belong to the `ui-animation` skill. Route motion findings there for the fix.

## Visual direction and SEO → sibling

- Visual-direction polish (matching box-shadows to references, concentric border radius, optical alignment of icons/text, image outlines on light backgrounds, the fundamentals→visual→polish quality pyramid) belongs to this skill's Direction and Build modes, not to a built-UI defect check.
- SEO metadata, canonical/OG tags, and dynamic OG images belong to the `optimise-seo` skill.
