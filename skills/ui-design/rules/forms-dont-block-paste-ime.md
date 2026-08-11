---
title: Do Not Block Paste or IME Input
id: forms-dont-block-paste-ime
category: forms
defaultTier: fix-this-sprint
detect: static
---

## Do Not Block Paste or IME Input

Avoid handlers that prevent paste or aggressively filter keystrokes. Blocking paste breaks password managers and assistive input, and keystroke filters swallow the composition events IME users type with.

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
