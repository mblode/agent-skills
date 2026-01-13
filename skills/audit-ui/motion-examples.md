# Motion Examples and Reference

Use these snippets and references when implementing rules from `motion-guidelines`.

## Contents
- Principles examples
- What to animate examples
- Spatial rules and stagger
- Easing reference
- Hover transitions
- Accessibility and reduced motion
- Origin-aware animations
- Performance recipes

## Principles examples
```css
/* Panel.module.css */
.panel {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  .panel {
    transition-duration: 1ms;
  }
}
```

```tsx
// app/components/Panel.tsx
"use client";
import { motion } from "framer-motion";
import styles from "./Panel.module.css";

export function Panel() {
  return (
    <motion.div
      className={styles.panel}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
```

## What to animate examples
```css
/* Toast.module.css */
.toast {
  transform: translate3d(0, 6px, 0);
  opacity: 0;
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.toast[data-open="true"] {
  transform: translate3d(0, 0, 0);
  opacity: 1;
}

/* Disable transitions during theme switch */
[data-theme-switching="true"] * {
  transition: none !important;
}
```

```tsx
// app/components/Toast.tsx
"use client";
import clsx from "clsx";
import styles from "./Toast.module.css";

export function Toast({ open }: { open: boolean }) {
  return (
    <div className={clsx(styles.toast)} data-open={open}>
      Saved
    </div>
  );
}
```

## Spatial rules and stagger
```css
/* Menu.module.css */
.menu {
  transform-origin: top right;
  transform: scale(0.88);
  opacity: 0;
  transition: transform 200ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.menu[data-open="true"] {
  transform: scale(1);
  opacity: 1;
}

.list > * {
  animation: fade-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.list > *:nth-child(2) { animation-delay: 50ms; }
.list > *:nth-child(3) { animation-delay: 100ms; }
```

```tsx
const listVariants = {
  show: { transition: { staggerChildren: 0.05 } },
};
```

## Easing reference
- Default to `ease-out` for most animations.
- Do not use built-in easings unless it is `ease` or `linear`.
- Enter: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out).
- Move: `cubic-bezier(0.25, 1, 0.5, 1)` (ease-in-out).
- `ease-in` (avoid; feels slow):
  - `ease-in-quad`: `cubic-bezier(.55, .085, .68, .53)`
  - `ease-in-cubic`: `cubic-bezier(.550, .055, .675, .19)`
  - `ease-in-quart`: `cubic-bezier(.895, .03, .685, .22)`
  - `ease-in-quint`: `cubic-bezier(.755, .05, .855, .06)`
  - `ease-in-expo`: `cubic-bezier(.95, .05, .795, .035)`
  - `ease-in-circ`: `cubic-bezier(.6, .04, .98, .335)`
- `ease-out` (entering/interactions):
  - `ease-out-quad`: `cubic-bezier(.25, .46, .45, .94)`
  - `ease-out-cubic`: `cubic-bezier(.215, .61, .355, 1)`
  - `ease-out-quart`: `cubic-bezier(.165, .84, .44, 1)`
  - `ease-out-quint`: `cubic-bezier(.23, 1, .32, 1)`
  - `ease-out-expo`: `cubic-bezier(.19, 1, .22, 1)`
  - `ease-out-circ`: `cubic-bezier(.075, .82, .165, 1)`
- `ease-in-out` (moving within screen):
  - `ease-in-out-quad`: `cubic-bezier(.455, .03, .515, .955)`
  - `ease-in-out-cubic`: `cubic-bezier(.645, .045, .355, 1)`
  - `ease-in-out-quart`: `cubic-bezier(.77, 0, .175, 1)`
  - `ease-in-out-quint`: `cubic-bezier(.86, 0, .07, 1)`
  - `ease-in-out-expo`: `cubic-bezier(1, 0, 0, 1)`
  - `ease-in-out-circ`: `cubic-bezier(.785, .135, .15, .86)`

### Drawer example
```css
.drawer {
  transition: transform 240ms cubic-bezier(0.25, 1, 0.5, 1);
}
```

```tsx
<motion.aside
  initial={{ transform: "translate3d(100%, 0, 0)" }}
  animate={{ transform: "translate3d(0, 0, 0)" }}
  exit={{ transform: "translate3d(100%, 0, 0)" }}
  transition={{ duration: 0.24, ease: [0.25, 1, 0.5, 1] }}
/>
```

## Hover transitions
- Use `ease` with `200ms` for simple hover transitions (`color`, `background-color`, `opacity`).
- For complex hover motion, follow the easing rules above.
- Disable hover transitions on touch devices via `@media (hover: hover) and (pointer: fine)`.

```css
/* Link.module.css */
@media (hover: hover) and (pointer: fine) {
  .link {
    transition: color 200ms ease, opacity 200ms ease;
  }
  .link:hover {
    opacity: 0.8;
  }
}
```

## Accessibility and reduced motion
- If `transform` is used, disable it in `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  .menu,
  .toast {
    transform: none;
  }
}
```

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";

export function AnimatedCard() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
    />
  );
}
```

## Origin-aware animations
- Elements should animate from the trigger; adjust `transform-origin` to the trigger position.

```css
.popover[data-side="top"]    { transform-origin: bottom center; }
.popover[data-side="bottom"] { transform-origin: top center; }
.popover[data-side="left"]   { transform-origin: center right; }
.popover[data-side="right"]  { transform-origin: center left; }
```

## Performance recipes
- Pause looping animations off-screen.
- Do not animate drag gestures using CSS variables.
- Toggle `will-change` only during heavy animations.
- Only use `will-change` for `transform`, `opacity`, `clipPath`, `filter`.
- In Motion/Framer Motion, prefer `transform` over `x`/`y`.
- Use springs by default; avoid bouncy springs unless dragging.

```css
.animating {
  will-change: transform, opacity;
}
```

```tsx
<motion.div
  animate={{ transform: "translate3d(0, 0, 0)" }}
  transition={{ type: "spring", stiffness: 500, damping: 40 }}
/>
```

```js
// app/hooks/usePauseOffscreen.ts
"use client";
import { useEffect, useRef } from "react";

export function usePauseOffscreen<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
```
