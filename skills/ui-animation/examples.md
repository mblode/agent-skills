# UI Animation Examples

Use these snippets and tips when implementing the core rules in `SKILL.md`.

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
- Enter: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Move: `cubic-bezier(0.25, 1, 0.5, 1)`.
- Simple hover colour/opacity: `200ms ease`.
- Avoid `ease-in` for UI (feels slow).

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

## Practical tips

### Record your animations
When something feels off but you cannot identify why, record the animation and play it back frame by frame.

### Fix shaky animations
Elements can shift by 1px at the start/end of CSS transforms due to GPU/CPU handoff.

```css
.element {
  will-change: transform;
}
```

### Scale buttons on press
```css
button:active {
  transform: scale(0.97);
}
```

### Avoid animating from scale(0)
```css
.element {
  transform: scale(0.95);
  opacity: 0;
}
.element.visible {
  transform: scale(1);
  opacity: 1;
}
```

### Skip animation on subsequent tooltips
```css
.tooltip {
  transition:
    transform 125ms ease-out,
    opacity 125ms ease-out;
  transform-origin: var(--transform-origin);
}
.tooltip[data-starting-style],
.tooltip[data-ending-style] {
  opacity: 0;
  transform: scale(0.97);
}
/* Skip animation for subsequent tooltips */
.tooltip[data-instant] {
  transition-duration: 0ms;
}
```

### Keep animations fast
UI motion should stay under 300ms for core interactions.

### Do not animate keyboard interactions
Never animate:
- List navigation with arrow keys
- Keyboard shortcut responses
- Tab/focus movements

### Fix hover flicker
```html
<div class="box">
  <div class="box-inner"></div>
</div>
```

```css
.box:hover .box-inner {
  transform: translateY(-20%);
}
.box-inner {
  transition: transform 200ms ease;
}
```

### Disable hover on touch devices
```css
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: scale(1.05);
  }
}
```

### Ensure appropriate target areas
Minimum target size is 44px (Apple and WCAG recommendation).

```css
@utility touch-hitbox {
  position: relative;
}
@utility touch-hitbox::before {
  content: "";
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  min-height: 44px;
  min-width: 44px;
  z-index: 9999;
}
```

```jsx
<button className="touch-hitbox">
  <BellIcon />
</button>
```

### Use blur as a fallback
```css
.button-transition {
  transition:
    transform 150ms ease-out,
    filter 150ms ease-out;
}
.button-transition:active {
  transform: scale(0.97);
  filter: blur(2px);
}
```

Keep blur under 20px, especially on Safari.
