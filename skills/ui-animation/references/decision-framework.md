# Animation Decision Framework

Before writing any animation code, answer these four questions in order.

## 1. Should this animate at all?

**How often will users see this animation?**

| Frequency | Examples | Decision |
|---|---|---|
| 100+ times/day | Keyboard shortcuts, command palette toggle | No animation. Ever. |
| Tens of times/day | Hover effects, list navigation | Remove or drastically reduce |
| Occasional | Modals, drawers, toasts | Standard animation |
| Rare / first-time | Onboarding, feedback forms, celebrations | Can add delight |

Never animate keyboard-initiated actions. They repeat hundreds of times daily — animation makes them feel slow and disconnected.

## 2. What is the purpose?

Answer "why does this animate?" before writing code.

| Purpose | Description | Example |
|---|---|---|
| **Feedback** | Confirms user action was received | Button scale on press, toggle state |
| **Orientation** | Shows spatial relationship | Drawer slides from edge, menu scales from trigger |
| **Continuity** | Preserves context across state changes | Page transitions, layout shifts |
| **Delight** | Adds personality (use sparingly) | Stagger reveals, spring overshoot |

If the purpose is just "it looks cool" and the user will see it often, don't animate.

## 3. What easing should it use?

Follow this decision tree:

- **Entering the viewport?** → enter curve: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Exiting the viewport?** → same curve, shorter duration
- **Moving/sliding on screen?** → move curve: `cubic-bezier(0.25, 1, 0.5, 1)`
- **Simple hover (color/opacity)?** → `200ms ease`
- **Needs physics feel?** → spring
- **Direct manipulation (drag)?** → no easing, follow the pointer
- **Constant motion (marquee, spinner)?** → `linear`

Use custom easing curves. Avoid `ease-in` for UI.

**Easing resources:** [easing.dev](https://easing.dev/) and [easings.co](https://easings.co/) for stronger custom variants.

## 4. How fast should it be?

| Element | Duration |
|---|---|
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modals, drawers | 200–350ms |
| Page transitions | 250–400ms |
| Illustrative / marketing | Up to 1000ms |

**Rule: keep routine UI animation under 300ms.**

### Perceived performance

Animation speed changes perceived performance:

- A fast-spinning spinner makes loading feel faster (same load time, different perception)
- `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms because the user sees immediate movement
- Instant tooltips after the first one is open (skip delay + skip animation) make the toolbar feel faster

### Asymmetric timing

Enter can be slightly slower than exit. Example: hold-to-delete uses 2s linear on press, 200ms ease-out on release.

```css
/* Release: fast */
.overlay {
  transition: clip-path 200ms ease-out;
}

/* Press: slow and deliberate */
.button:active .overlay {
  transition: clip-path 2s linear;
}
```
