# UI Animation Examples

Snippets and tips for the core rules in `SKILL.md`.

## Table of contents
- [Enter and exit](#enter-and-exit)
- [Spatial rules and stagger](#spatial-rules-and-stagger)
- [Drawer (move easing)](#drawer-move-easing)
- [Hover transitions](#hover-transitions)
- [Reduced motion](#reduced-motion)
- [Origin-aware animations](#origin-aware-animations)
- [Performance recipes](#performance-recipes)
- [Practical tips](#practical-tips)

## Enter and exit
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
// app/components/Panel.tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";

export function Panel() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
      }
    />
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

## Drawer (move easing)
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

## Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  .menu,
  .toast {
    transform: none;
    transition: none;
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

### Pause looping animations off-screen
```ts
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

### Toggle will-change during animation
```css
.animating {
  will-change: transform, opacity;
}
```

### Spring defaults (framer-motion)
```tsx
<motion.div
  animate={{ transform: "translate3d(0, 0, 0)" }}
  transition={{ type: "spring", stiffness: 500, damping: 40 }}
/>
```

## Practical tips

### Record your animations
When something feels off, record the animation and play it back frame by frame.

### Fix shaky 1px shifts
Elements can shift by 1px at the start/end of CSS transforms due to GPU/CPU handoff. Apply `will-change: transform` during the animation (not permanently) to keep compositing on the GPU.

### Scale buttons on press
```css
button:active {
  transform: scale(0.97);
  opacity: 0.9;
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
.tooltip[data-instant] {
  transition-duration: 0ms;
}
```

### Fix hover flicker
Apply the hover effect on a parent, animate the child:
```css
.box:hover .box-inner {
  transform: translateY(-20%);
}
.box-inner {
  transition: transform 200ms ease;
}
```
