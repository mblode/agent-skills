---
title: Do Not Block Paste or IME Input
id: forms-dont-block-paste-ime
category: forms
defaultTier: fix-this-sprint
detect: static
---

## Do Not Block Paste or IME Input

Avoid handlers that prevent paste or aggressively filter keystrokes. Blocking paste breaks password managers and assistive input, and keystroke filters swallow the composition events IME users type with.

## Detection

Search for `onPaste` handlers that call `preventDefault`, then read the handler body to confirm nothing re-inserts the pasted text.

```bash
rg -nUP 'onPaste=\{[^}]*preventDefault' -g '*.tsx' -g '*.jsx' src/
```

A sanitizing paste handler (calls `preventDefault`, then reads `e.clipboardData` and writes the cleaned value back) matches too and is legitimate. If the handler never touches `clipboardData`, paste is simply blocked.

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
