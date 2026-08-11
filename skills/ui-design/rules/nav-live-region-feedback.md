---
title: Announce Status Changes with Live Regions
id: nav-live-region-feedback
category: nav
defaultTier: fix-this-sprint
detect: static
---

## Announce Status Changes with Live Regions

Toasts and validation summaries should use polite live regions unless interruption is critical. A toast that is only painted on screen never reaches assistive tech, so the user never learns the action finished.

## Detection

Find toast, snackbar, and notification containers rendered as plain JSX, then keep only the files with no live-region attribute anywhere in them.

```bash
rg -lP 'className="[^"]*\b(toast|snackbar|notification|banner)\b' -g '*.tsx' -g '*.jsx' src/ \
| xargs -r rg --files-without-match -P 'aria-live|role="(status|alert)"'
```

A file that renders its own toast markup but delegates the announcement to a shared `<Toaster />` (sonner, react-hot-toast, Radix Toast) is a false positive: those libraries own the live region. Confirm by checking whether the toast is mounted through the library's provider or painted directly by this component.

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
