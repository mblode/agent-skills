# Animation Decision Framework

## Contents
- [1. Should this animate at all?](#1-should-this-animate-at-all)
- [2. What is the purpose?](#2-what-is-the-purpose)
- [3. What easing should it use?](#3-what-easing-should-it-use)
- [4. How fast should it be?](#4-how-fast-should-it-be)

Answer these four questions in order before writing animation code. SKILL.md carries the duration table, the named curves, and the pattern-to-recipe map; this file is the reasoning that picks between them.

## 1. Should this animate at all?

**How often will users see this animation?**

| Frequency | Examples | Decision |
|---|---|---|
| 100+ times/day | Keyboard shortcuts, command palette toggle | No animation. Ever. |
| Tens of times/day | Hover effects, list navigation | Remove or drastically reduce |
| Occasional | Modals, drawers, toasts | Standard animation |
| Rare / first-time | Onboarding, feedback forms, celebrations | Can add delight |

## 2. What is the purpose?

Answer "why does this animate?" before writing code.

| Purpose | Description | Example |
|---|---|---|
| **Feedback** | Confirms user action was received | Button scale on press, toggle state |
| **Orientation** | Shows spatial relationship | Drawer slides from edge, menu scales from trigger |
| **Continuity** | Preserves context across state changes | Page transitions, layout shifts |
| **Delight** | Adds personality (use sparingly) | Stagger reveals, spring overshoot |

## 3. What easing should it use?

Two cases the named curves in SKILL.md do not cover:

- **Needs physics feel?** → spring ([spring-animations.md](spring-animations.md))
- **Constant motion (marquee, spinner)?** → `linear`

Match curve strength to size and frequency: weaker curves (quad, cubic) for small or frequent elements, stronger curves (quint, expo) for large or rare transitions. Full named catalogue at [easing.dev](https://easing.dev/), stronger custom variants at [easings.co](https://easings.co/).

### Asymmetric vs symmetric curves

Symmetric ease-in-out starts slow: a noticeable lag between the user's action and the element beginning to move. For interactive elements (drawers, panels, menus), use asymmetric curves, steep at the start and settling slowly, to preserve responsiveness while the slow deceleration adds quality. A steep curve covers most of its distance in the first third, so the same 200ms reads as significantly faster.

Duration and easing are inseparable: a steep curve affords a longer duration because the movement is front-loaded. Vaul's drawer uses 500ms with `cubic-bezier(0.32, 0.72, 0, 1)` but doesn't feel slow, covering most of its distance in the first 200ms.

## 4. How fast should it be?

Duration changes perceived performance independently of actual speed:

- A fast-spinning spinner makes loading feel faster (same elapsed time, different perception)
- `ease-out` at 200ms _feels_ faster than `ease-in` at 200ms: the user sees immediate movement
- Instant tooltips after the first opens (skip delay and animation) make the whole toolbar feel faster
