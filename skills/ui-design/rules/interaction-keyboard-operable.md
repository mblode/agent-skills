---
title: Ensure Full Keyboard Operability
id: interaction-keyboard-operable
category: interaction
defaultTier: release-blocker
detect: static
---

## Ensure Full Keyboard Operability

Pointer-only handlers are not acceptable for critical actions. Anything reachable only by pointer cannot be completed by keyboard, switch, or screen reader users at all.

## Detection

Search for elements given a button role or a focusable `tabIndex` that carry no key handler; a hit is confirmed when the element's action has no keyboard path.

```bash
rg -nUP '<[A-Za-z][^>]*\b(role="button"|tabIndex=\{[0-9])[^>]*>' -g '*.tsx' -g '*.jsx' src/ \
| rg -v 'onKeyDown|onKeyUp|onKeyPress'
```

Headless libraries spread the handlers in (`{...getButtonProps()}`, Radix `asChild`), so the keyboard path is real but lives in the hook, not this file. A clickable element with no role at all does not match here: that is `a11y-semantic-html-first`.

**Incorrect (mouse only):**

```tsx
<div onClick={openMenu}>Open menu</div>
```

**Correct (keyboard + pointer by default):**

```tsx
<button type="button" onClick={openMenu}>Open menu</button>
```
