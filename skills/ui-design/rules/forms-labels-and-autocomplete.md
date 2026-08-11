---
title: Label Inputs and Set Autocomplete Metadata
id: forms-labels-and-autocomplete
category: forms
defaultTier: release-blocker
detect: static
---

## Label Inputs and Set Autocomplete Metadata

Inputs require explicit labels and appropriate `type`, `name`, and `autocomplete` values. Without them users retype data the browser already has, and assistive tech has no name to announce.

**Incorrect (placeholder-only label):**

```tsx
<input placeholder="Email" />
```

**Correct (explicit label + metadata):**

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  inputMode="email"
/>
```
