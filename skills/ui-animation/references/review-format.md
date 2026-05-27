# Animation Review Format

## Before/After/Why table

Use a markdown table. One row per issue.

| Before | After | Why |
|---|---|---|
| `transition: all 300ms` | `transition: transform 200ms ease-out` | Specify exact properties; avoid `all` |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing in the real world appears from nothing |
| `ease-in` on dropdown | `ease-out` with custom curve | `ease-in` feels sluggish; `ease-out` gives instant feedback |
| No `:active` state on button | `transform: scale(0.97)` on `:active` | Buttons must feel responsive to press |
| `transform-origin: center` on popover | `transform-origin: var(--radix-popover-content-transform-origin)` | Popovers scale from trigger (modals stay centered) |

## Review checklist

| Issue | Fix |
|---|---|
| `transition: all` | Target specific properties |
| Layout property animated (`width`, `height`, `top`, `left`) | Switch to `transform` and `opacity` |
| `ease-in` on UI entrance | Use enter easing: `cubic-bezier(0.22, 1, 0.36, 1)` |
| Permanent `will-change` | Toggle during animation only |
| `scale(0)` start | Use `scale(0.85–0.95)` with `opacity: 0` |
| No touch device guard on hover | Add `@media (hover: hover) and (pointer: fine)` |
| Symmetric enter/exit timing | Make exit 20–30% faster than enter |
| CSS variable drag animation | Use `transform` directly on the element |
| Missing `setPointerCapture` on drag | Add pointer capture for reliable tracking |
| Motion `x`/`y` mixed with a handwritten `transform` | Pick one transform owner for the element |
| Animation on keyboard action | Remove animation entirely |
| Duration > 300ms on UI element | Reduce to 150–250ms |
| Keyframes on rapidly-triggered element | Use CSS transitions for interruptibility |
| Hard cut between views sharing elements | Add shared-element transition; animate persistent components in place |
| Contextual overlay enters from centre | Set `transform-origin` to trigger; animate outward from source element |
| Elements all appear at once | Add stagger delay (30–50ms between items) |
| Touch target under 44px on interactive element | Add `::before` pseudo-element sized to 44x44px minimum (WCAG 2.5.5) |
| Hover scale > 1.03 or hover duration > 150ms | Use `scale(1.01–1.02)` and 100–150ms transition |
| Container animates AND children stagger | Pick one entrance: animate the container OR stagger children, not both |
| Missing close-state cleanup after `setTimeout` | Add `is-closing` class, remove after transition duration completes |
| Missing reflow (`void el.offsetWidth`) between class changes | Force reflow before re-adding classes to restart transitions |
| Animating container instead of inner pieces | Apply transitions to child elements, not the wrapper |
| Hardcoded `stroke-dasharray` on SVG success path | Use `path.getTotalLength()` to measure the actual path length |
| `.is-error` and `.is-shaking` merged into one class | Keep them separate — `.is-shaking` controls animation only, `.is-error` controls visual state |

## Component design principles

- **Good defaults over options.** Most users never customise. The default easing, timing, and design should be excellent out of the box.
- **Transitions over keyframes for dynamic UI.** Elements added rapidly (toasts, list items) need interruptible animations. Keyframes restart from zero on interruption; transitions retarget smoothly.
- **Cohesion.** The animation style should match the component's personality. A playful component can be bouncier. A professional dashboard should be crisp and fast.
- **Invisible edge cases.** Pause timers when the tab is hidden. Fill gaps between stacked elements with pseudo-elements to maintain hover state. Capture pointer events during drag.

## Debugging animations

- **Slow motion:** Temporarily increase duration to 2–5x or use the browser animation inspector. Check colour timing, easing, and transform-origin.
- **Frame-by-frame:** Step through in Chrome DevTools Animations panel to reveal timing issues between coordinated properties.
- **Real devices:** For touch interactions (drawers, swipe gestures), test on physical devices. The Xcode Simulator works but real hardware is better for gesture testing.
- **Review next day:** You notice imperfections with fresh eyes that you missed during development.
