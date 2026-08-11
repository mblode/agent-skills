---
title: Label Inputs and Set Autocomplete Metadata
id: forms-labels-and-autocomplete
category: forms
defaultTier: release-blocker
detect: static
---

## Label Inputs and Set Autocomplete Metadata

Inputs require explicit labels and appropriate `type`, `name`, and `autocomplete` values. Without them users retype data the browser already has, and assistive tech has no name to announce.

## Detection

Search for inputs carrying a `placeholder` but no `id` and no `aria-label`, which is the placeholder-as-label shape.

```bash
rg -nUP '<input\b(?![^>]*\bid=)(?![^>]*aria-label)[^>]*placeholder=' -g '*.tsx' -g '*.jsx' src/
```

An input nested inside its own `<label>` element is implicitly labelled and needs no `id`, so check the enclosing element before reporting. Design-system `<Input>` wrappers generate the `id` from context and are skipped by the lowercase pattern; audit the wrapper itself once instead.

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
