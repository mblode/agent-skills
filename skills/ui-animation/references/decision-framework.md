# Animation Decision Framework

## Contents
- [1. Should this animate at all?](#1-should-this-animate-at-all)
- [2. What is the purpose?](#2-what-is-the-purpose)
- [3. What easing should it use?](#3-what-easing-should-it-use)
- [4. How fast should it be?](#4-how-fast-should-it-be)

Answer these four questions in order before writing animation code.

## 1. Should this animate at all?

**How often will users see this animation?**

| Frequency | Examples | Decision |
|---|---|---|
| 100+ times/day | Keyboard shortcuts, command palette toggle | No animation. Ever. |
| Tens of times/day | Hover effects, list navigation | Remove or drastically reduce |
| Occasional | Modals, drawers, toasts | Standard animation |
| Rare / first-time | Onboarding, feedback forms, celebrations | Can add delight |

Never animate keyboard-initiated actions; they repeat hundreds of times daily and animation makes them feel slow and disconnected.

## 2. What is the purpose?

Answer "why does this animate?" before writing code.

| Purpose | Description | Example |
|---|---|---|
| **Feedback** | Confirms user action was received | Button scale on press, toggle state |
| **Orientation** | Shows spatial relationship | Drawer slides from edge, menu scales from trigger |
| **Continuity** | Preserves context across state changes | Page transitions, layout shifts |
| **Delight** | Adds personality (use sparingly) | Stagger reveals, spring overshoot |

If the purpose is just "it looks cool" and users see it often, don't animate.

## 3. What easing should it use?

Follow this decision tree:

- **Entering the viewport?** → enter curve: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Exiting the viewport?** → same curve, shorter duration
- **Moving/sliding on screen?** → move curve: `cubic-bezier(0.25, 1, 0.5, 1)`
- **Simple hover (color/opacity)?** → `200ms ease`
- **Needs physics feel?** → spring
- **Direct manipulation (drag)?** → no easing, follow the pointer
- **Constant motion (marquee, spinner)?** → `linear`

Avoid `ease-in` for UI; it starts slow and feels sluggish. Built-in `ease-out`/`ease` have gentle acceleration that reads soft rather than decisive. Custom curves like `cubic-bezier(0.22, 1, 0.36, 1)` accelerate steeply (the element covers most of its distance in the first third), so the same 200ms feels significantly faster.

**Easing resources:** [easing.dev](https://easing.dev/) and [easings.co](https://easings.co/) for stronger custom variants.

For a full named cubic-bezier catalogue (ease-out-quad through ease-out-expo, symmetric variants), see [easing.dev](https://easing.dev/); SKILL.md ships the actionable defaults. Use weaker curves (quad, cubic) for small or frequent elements; stronger curves (quint, expo) for large or rare transitions.

### Asymmetric vs symmetric curves

Symmetric ease-in-out starts slow: a noticeable lag between the user's action and the element beginning to move. For interactive elements (drawers, panels, menus), use asymmetric curves, steep at the start and settling slowly, to preserve responsiveness while the slow deceleration adds quality.

Duration and easing are inseparable: a steep curve affords a longer duration because the movement is front-loaded. Vaul's drawer uses 500ms with `cubic-bezier(0.32, 0.72, 0, 1)` but doesn't feel slow, covering most of its distance in the first 200ms.

## 4. How fast should it be?

Pick duration from the easing defaults table in SKILL.md. Keep routine UI under 300ms; scale with distance: a full-screen menu can exceed 300ms, a 6px tooltip shift under 150ms.

### Perceived performance

Animation speed changes perceived performance:

- Fast-spinning spinner makes loading feel faster (same time, different perception)
- `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms: user sees immediate movement
- Instant tooltips after the first opens (skip delay and animation) make the toolbar feel faster

### Asymmetric timing

Enter can be slightly slower than exit. Hold-to-delete: 2s linear on press, 200ms ease-out on release.

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

### Instant enter, animated exit (productivity tools)

Restates SKILL.md's asymmetric-timing core rule for high-frequency ephemeral UI: enter instantly (0ms), exit with a brief fade (100-150ms).

```css
/* Hover highlight: instant appear, soft dismiss */
.highlight {
  transition: opacity 0.15s ease-out;
  opacity: 0;
}
.item:hover .highlight {
  transition-duration: 0s;
  opacity: 1;
}
```

Once the element should animate, match the UI pattern to a recipe via the "Transition decision rules" table in SKILL.md.
