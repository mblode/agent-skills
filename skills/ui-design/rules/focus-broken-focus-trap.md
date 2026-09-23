---
title: Modal without working focus trap
id: focus-broken-focus-trap
category: focus
defaultTier: release-blocker
detect: static
related: focus-not-restored, focus-on-dynamic-content, states-no-error-state
---

## Modal without working focus trap

When a modal opens, Tab and Shift+Tab must cycle inside it and Esc must close it. Without a focus trap, keyboard users tab into the page behind the modal, lose context, and may not realise it is open. Hand-rolled traps almost always miss edge cases (iframes, contenteditable, dynamically-added focusables). Use a primitive that gets it right: Radix UI, react-aria, or `focus-trap-react`.

## What goes wrong

A custom `<div role="dialog">` opens. The user presses Tab; focus moves to a body link below the modal. They keep tabbing and navigate the page underneath, hidden by the scrim. Total disorientation. Screen-reader users fare worse: VoiceOver navigates the entire DOM, ignoring the modal.

## Detection

**Surfaces:** modal, sheet, drawer, popover, command-palette.

**Static signals:**
1. `rg 'role="dialog"|role="alertdialog"' --type=ts -l`: find all dialog markup.
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
rg 'role="(dialog|alertdialog)"' --type=ts -l | while read f; do
  rg -q '@radix-ui/react-dialog|react-aria|focus-trap-react|@headlessui/react' "$f" \
    || echo "$f: dialog without trap library"
done

# Components named *Modal*/*Dialog* without primitive
rg -l --type=ts '(Modal|Dialog|Sheet|Drawer|Popover)\b' src/ | while read f; do
  rg -q '@radix-ui|react-aria|@headlessui|focus-trap' "$f" \
    || echo "$f: custom modal without primitive"
done
```

**False-positive guards:**
- Skip non-modal dialogs (`role="dialog"` with `aria-modal="false"`: rare, but valid).
- Skip components imported from a known wrapper that already uses Radix/react-aria internally.
- Skip files annotated `// ui-audit-ignore:focus-broken-focus-trap`.

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
- react-aria Modal: https://react-aria.adobe.com/Modal
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

## Defer-to (when this is another tool's job)

- axe-core / jsx-a11y for missing `aria-labelledby`/`aria-label` on the dialog.
- Lighthouse a11y audits for the WCAG-criteria coverage.
- Manual VoiceOver / NVDA pass for screen-reader correctness.

## Suppression

```tsx
{/* ui-audit-ignore:focus-broken-focus-trap, non-modal popover, trap intentionally off */}
```
