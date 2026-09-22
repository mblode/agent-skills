# Probe: focus walk

Presses Tab repeatedly and records where focus actually went. Focus bugs are invisible to everyone driving with a mouse, which is why they ship, and they are the class of defect a static read is worst at: `focus-not-restored` depends on what a component library does on unmount, not on what the calling code says.

## What it measures

Four things, from one traversal plus one dialog cycle:

1. The focus order, as a list of elements with their boxes, compared against DOM order.
2. Whether each focused element shows a visible indicator, decided by pixel delta.
3. Whether an open dialog holds focus and closes on Escape.
4. Where focus lands after the dialog closes.

## Running it

```bash
node <skill>/scripts/verify/probe.mjs focus-walk --url <url> [--dialog-trigger <selector>]
```

## What the script does

Presses Tab until focus returns to the first stop (capped at three times the focusable count), piercing shadow roots, and records each stop's box. Chromium hands focus to the browser once per cycle at the document end, so one `escaped` step is the boundary; the signal is `visited` below `tabbable`. Piercing shadow roots matters: a design system built on web components reports `document.activeElement` as the host for every step, and the traversal looks like one element repeating.

Focus indicator: computed style cannot decide it. `outline: none` replaced by a `box-shadow` ring is a pass; a ring the same colour as the surface behind it is a fail, and both read identically in CSS. The script screenshots each keyboard-focused stop padded by 6px, reloads, screenshots the same regions unfocused, and lists stops where under about 2% of pixels changed as `lowIndicator`. The keyboard detail is load-bearing. Programmatic focus does not match `:focus-visible` in Chromium, so a scripted `el.focus()` reports a missing ring on a control that has one.

Dialog cycle (`--dialog-trigger`): the script activates the trigger from the keyboard and asserts in order: focus moved inside the dialog subtree; Tab from the last focusable element returns to the first rather than escaping to the page behind; Escape closes it; `document.activeElement` after close is the trigger element itself, not `body` and not the top of the document.

The trigger's selector is what the restoration assertion compares against.

## Paste and IME

Two assertions to run while the keyboard is already driving the page, since both are input handlers that look correct in source and fail at runtime.

The script dispatches a paste event on every visible text field and lists the fields whose handler cancels it (`pasteBlocked`): an `onPaste` preventing default, common on "confirm email" and card-number inputs, is `forms-dont-block-paste-ime`.

Composition is not scripted: dispatch `compositionstart`, `compositionupdate` and `compositionend` around a multi-character insertion and assert the committed value survived. A field that reformats or validates on every keystroke destroys an in-flight composition, so a Japanese or Korean user cannot type into it at all.

## Reading the result

| Observation | Rule id |
|---|---|
| `visited` below `tabbable`: a visible control the walk never reached | `interaction-keyboard-operable` |
| Focus order diverges from visual reading order | `interaction-keyboard-operable` |
| A stop in `lowIndicator` (pixel delta under about 2%) | `interaction-focus-visible` |
| Tab leaves an open modal, or Escape does not close it | `focus-broken-focus-trap` |
| Focus after close is not the trigger | `focus-not-restored` |
| New content rendered and focus stayed where it was | `focus-on-dynamic-content` |
| `offscreen` above 0: a focused element outside the viewport after scrolling it into view | `interaction-focus-visible` |
| A field in `pasteBlocked`, or a composition destroyed | `forms-dont-block-paste-ime` |

## False positives to guard

- **A skip link is invisible until focused and then appears at the top.** It reads as a focus-order anomaly on the first press and is correct.
- **An infinite or virtualised list** never cycles back within the limit. Cap the traversal and report the cap rather than a trap.
- **Custom widgets that use roving tabindex** (a toolbar, a listbox, a grid) intentionally expose one tab stop and move within it using arrow keys. Fewer tab stops than interactive elements is correct there; test the arrows before reporting an operability failure.
- **A dialog that intentionally returns focus elsewhere** after a destructive action (the trigger no longer exists) is correct. Fail only when focus went to `body` or the document top.

## Evidence to write

`focus-trail.json` with the full ordered list, the before and after crops for any indicator failure, and the pre-open and post-close `activeElement` for the dialog cycle.
