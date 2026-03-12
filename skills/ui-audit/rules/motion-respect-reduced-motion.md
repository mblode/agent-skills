---
title: Respect Reduced-Motion Preferences
impact: CRITICAL
impactDescription: avoids vestibular-triggering motion
tags: motion, accessibility, reduced-motion
---

## Respect Reduced-Motion Preferences

Provide reduced-motion fallbacks for transitions and animations.

**Incorrect (forced animation):**

```css
.modal {
  animation: pop-in 260ms cubic-bezier(.2,.8,.2,1);
}
```

**Correct (reduced-motion aware):**

```css
@media (prefers-reduced-motion: reduce) {
  .modal {
    animation: none;
    transition: none;
  }
}
```
