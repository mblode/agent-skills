---
title: Announce Status Changes with Live Regions
id: nav-live-region-feedback
category: nav
defaultTier: fix-this-sprint
detect: static
---

## Announce Status Changes with Live Regions

Toasts and validation summaries should use polite live regions unless interruption is critical. A toast that is only painted on screen never reaches assistive tech, so the user never learns the action finished.

**Incorrect (visual-only toast):**

```tsx
<div className="toast">Saved</div>
```

**Correct (announced toast):**

```tsx
<div role="status" aria-live="polite" className="toast">
  Changes saved
</div>
```
