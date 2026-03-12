---
title: Do Not Block Paste or IME Input
impact: HIGH
impactDescription: preserves accessibility and international input support
tags: forms, paste, ime
---

## Do Not Block Paste or IME Input

Avoid handlers that prevent paste or aggressively filter keystrokes.

**Incorrect (blocks user input):**

```tsx
<input onPaste={(e) => e.preventDefault()} onKeyDown={blockNonDigits} />
```

**Correct (accept input, validate after):**

```tsx
<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={() => validate(value.trimEnd())}
/>
```
