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

Long and multi-step forms need persistence across renders, refreshes, and accidental navigations: filling 12 fields then hitting a stray link should not wipe the form. Fix: autosave to `localStorage`/`sessionStorage`, debounced on change, restored on mount.

## Contents

- What goes wrong
- Detection
- Fix
- Default tier and overrides
- Examples
- Defer-to
- Suppression

## What goes wrong

Job-application form, 6 fields on page 1, 4 on page 2: user clicks Next, goes back to fix a typo, page 1 is blank. Or a call interrupts, the tab reloads, 20 minutes of typing gone. The component never wrote values outside React state.

## Detection

**Surfaces:** onboarding, multi-step form, long single-page form, checkout review step.

**Static signals:**
1. Candidate forms: `<form>` with ≥3 fields, OR a multi-step indicator (`step`, `currentStep`, `stepIndex`).
2. Check for persistence: `localStorage`, `sessionStorage`, IndexedDB, server-draft endpoint.
3. Fail if ≥3 fields AND no persistence call AND not a `<dialog>` quick-action.

**Concrete commands:**
```bash
# Forms with multi-step indicators
rg -l 'step|currentStep|stepIndex|multi-step' --type=ts src/ | while read f; do
  rg -l '<form' "$f"
done

# Forms missing localStorage persistence
rg -l '<form' --type=ts src/ | while read f; do
  rg -L 'localStorage|sessionStorage|saveDraft|persistDraft|useFormPersistence' "$f" \
    && echo "$f: form without autosave"
done

# Field count heuristic per form file
rg -c '<input|<textarea|<select' --type=ts src/
```

**False-positive guards:**
- Skip search forms (single `<input type="search">`).
- Skip sign-in / sign-up (never persist passwords; in-session preservation is `forms-lost-data-on-error`).
- Skip files with `// ui-audit-ignore:forms-no-autosave`.
- Skip components named `*ConfirmDialog*` or `*QuickAction*` (transient).

## Fix

Debounce a `localStorage` write on change, restore on mount:

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

- TanStack Form / React Hook Form ship persistence plugins; if one is already used, link its docs instead of hand-rolling.
- Collaborative forms: defer to a sync engine (Yjs, Liveblocks).

## Suppression

```tsx
{/* ui-audit-ignore:forms-no-autosave, password reset; persisting would be a security risk */}
<form action={resetPasswordAction}>
```
