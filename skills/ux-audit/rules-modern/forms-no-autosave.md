---
title: Long form has no autosave
slug: forms-no-autosave
category: forms
defaultTier: fix-this-sprint
surfaces: onboarding, form, checkout
react-apis: useEffect, useDebouncedCallback, localStorage
related: forms-lost-data-on-error
---

## Long form has no autosave

Multi-step forms and long single-page forms need persistence between renders, browser refreshes, and accidental navigations. A user who fills 12 fields, then clicks a stray link, should not start over. Autosave to `localStorage` or `sessionStorage` is the cheap fix: debounced on change, restored on mount.

## What goes wrong

User fills a job-application form: 6 fields on page 1, 4 fields on page 2. They click "Next," navigate back to fix a typo, and page 1 is blank. Or: a phone call interrupts, the tab times out, the laptop sleeps, the page reloads, and 20 minutes of typing is gone. There is no fallback because the component never wrote the values anywhere outside React state.

## Detection

**Surfaces:** onboarding, multi-step form, long single-page form, checkout review step.

**Static signals:**
1. Find candidate forms: `<form>` with ≥3 fields, OR a component that renders a multi-step indicator (look for `step`, `currentStep`, `stepIndex`).
2. Check for any persistence: `localStorage`, `sessionStorage`, IndexedDB, server-draft endpoint.
3. If form has ≥3 fields AND no persistence call AND is not a `<dialog>` quick-action, it fails.

**Concrete commands:**
```bash
# Forms with multi-step indicators
rg -l 'step|currentStep|stepIndex|multi-step' --type=tsx src/ | xargs rg -l '<form'

# Forms missing localStorage persistence
rg -l '<form' --type=tsx src/ | while read f; do
  rg -L 'localStorage|sessionStorage|saveDraft|persistDraft|useFormPersistence' "$f" \
    && echo "$f: form without autosave"
done

# Field count heuristic per form file
rg -c '<input|<textarea|<select' --type=tsx src/
```

**False-positive guards:**
- Skip search forms (single `<input type="search">`).
- Skip sign-in / sign-up (passwords should never be persisted; covered by `forms-lost-data-on-error` for in-session preservation).
- Skip files with `// ux-audit-ignore:forms-no-autosave`.
- Skip components named `*ConfirmDialog*` or `*QuickAction*` (transient).

## Fix

Debounce a write to `localStorage` on every change, restore on mount:

```tsx
// before
"use client";
export function ApplicationForm() {
  const [form, setForm] = useState({ name: "", role: "", bio: "" });
  return (
    <form action={submitApplication}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
      <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
    </form>
  );
}

// after
"use client";
import { useEffect, useState } from "react";

const KEY = "draft:application";

function useFormDraft<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  // Restore on mount
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { setValue(JSON.parse(raw)); } catch {}
    }
  }, [key]);

  // Debounced persist
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, 500);
    return () => clearTimeout(id);
  }, [key, value]);

  const clear = () => localStorage.removeItem(key);
  return [value, setValue, clear] as const;
}

export function ApplicationForm() {
  const [form, setForm, clearDraft] = useFormDraft(KEY, { name: "", role: "", bio: "" });
  return (
    <form
      action={async (fd) => {
        await submitApplication(fd);
        clearDraft();
      }}
    >
      <input name="name" value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input name="role" value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })} />
      <textarea name="bio" value={form.bio}
        onChange={(e) => setForm({ ...form, bio: e.target.value })} />
    </form>
  );
}
```

For multi-step flows, persist `{ step, fields }` together so resume returns to the right page.

Docs:
- React: https://react.dev/reference/react/useEffect
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Onboarding (≥3 steps) | release-blocker |
| Job application / long content form | release-blocker |
| Checkout (multi-step) | release-blocker |
| Sign-in | N/A (do not persist passwords) |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
const [form, setForm] = useState(emptyForm);
// no useEffect, no localStorage, no draft
return <form>...</form>;
```

**Applied (passes):**

```tsx
const [form, setForm, clearDraft] = useFormDraft("draft:onboarding", emptyForm);
```

## Defer-to (when this is another tool's job)

- TanStack Form / React Hook Form ship persistence plugins; if the codebase already uses one, link to its docs instead of hand-rolling.
- For collaborative forms, defer to a sync engine (Yjs, Liveblocks).

## Suppression

```tsx
{/* ux-audit-ignore:forms-no-autosave, password reset; persisting would be a security risk */}
<form action={resetPasswordAction}>
```
