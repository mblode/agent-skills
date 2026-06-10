---
title: Modal without working focus trap
slug: focus-broken-focus-trap
category: focus
defaultTier: release-blocker
surfaces: modal, sheet, drawer, popover
react-apis: Radix Dialog, react-aria-modal, focus-trap-react
related: focus-not-restored, focus-on-dynamic-content, states-no-error-state
---

## Modal without working focus trap

When a modal opens, Tab and Shift+Tab must cycle inside it. Esc must close it. Without a focus trap, keyboard users tab into the page behind the modal and lose context, and may not even realise the modal is open. Hand-rolled traps almost always have edge cases (iframes, contenteditable, dynamically-added focusables). The right answer is to use a primitive library that gets it right: Radix UI, react-aria, or `focus-trap-react`.

## What goes wrong

A custom `<div role="dialog">` opens. The user presses Tab. Focus moves to the body link below the modal. They keep tabbing. Now they're navigating the page underneath, but visually it's covered by the modal scrim. Total disorientation. Screen-reader users have an even worse time: VoiceOver navigates the entire DOM, ignoring the modal.

## Detection

**Surfaces:** modal, sheet, drawer, popover, command-palette.

**Static signals:**
1. `rg 'role="dialog"|role="alertdialog"' --type=tsx -l`: find all dialog markup.
2. For each file, confirm one of these imports/usages:
   - `@radix-ui/react-dialog` (built-in trap).
   - `react-aria` / `react-aria-components` (built-in trap).
   - `focus-trap-react` (`<FocusTrap>`).
   - Headless UI `<Dialog>`.
3. Flag any `role="dialog"` markup with no trap library import.
4. Bonus: confirm Esc closes the modal (`onKeyDown` for Escape OR primitive's built-in).

**Concrete commands:**
```bash
# Hand-rolled dialogs
rg 'role="(dialog|alertdialog)"' --type=tsx -l | while read f; do
  rg -L '@radix-ui/react-dialog|react-aria|focus-trap-react|@headlessui/react' "$f" \
    && echo "$f: dialog without trap library"
done

# Components named *Modal*/*Dialog* without primitive
rg -l --type=tsx '(Modal|Dialog|Sheet|Drawer|Popover)\b' src/ | while read f; do
  rg -L '@radix-ui|react-aria|@headlessui|focus-trap' "$f" \
    && echo "$f: custom modal without primitive"
done
```

**False-positive guards:**
- Skip non-modal dialogs (`role="dialog"` with `aria-modal="false"`: rare, but valid).
- Skip components imported from a known wrapper that already uses Radix/react-aria internally.
- Skip files annotated `// ux-audit-ignore:focus-broken-focus-trap`.

## Fix

Use Radix UI Dialog (or react-aria's `<Modal>`). Both ship with focus trap, restoration, Esc handling, scroll lock, and `aria-modal="true"`.

```tsx
// before: hand-rolled, no trap, no Esc
function MyModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true">
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  );
}

// after: Radix Dialog
import * as Dialog from '@radix-ui/react-dialog';

export function ConfirmDialog({ children, trigger }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 m-auto h-fit w-fit p-6">
          <Dialog.Title>Confirm</Dialog.Title>
          <Dialog.Description>Are you sure?</Dialog.Description>
          {children}
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

Docs:
- Radix Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
- react-aria Modal: https://react-spectrum.adobe.com/react-aria/Modal.html
- focus-trap-react: https://github.com/focus-trap/focus-trap-react

## Default tier and overrides

**Defaults to:** `release-blocker`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Sign-in / Checkout modal | release-blocker |
| Confirm-destruction dialog | release-blocker |
| Marketing newsletter modal | fix-this-sprint |
| Internal admin | fix-this-sprint |

## Examples

**Anti-pattern (fails):**
```tsx
<div role="dialog" aria-modal="true" className="fixed inset-0">
  <h2>Confirm</h2>
  <button onClick={onClose}>Cancel</button>
</div>
```

**Applied (passes):**
```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Content>...</Dialog.Content>
</Dialog.Root>
```

## Defer-to (when this is another tool's job)

- axe-core / jsx-a11y for missing `aria-labelledby`/`aria-label` on the dialog.
- Lighthouse a11y audits for the WCAG-criteria coverage.
- Manual VoiceOver / NVDA pass for screen-reader correctness.

## Suppression

```tsx
{/* ux-audit-ignore:focus-broken-focus-trap, non-modal popover, trap intentionally off */}
```
