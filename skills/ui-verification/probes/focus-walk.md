# Probe: focus walk

Presses Tab repeatedly and records where focus actually went. Focus bugs are invisible to everyone driving with a mouse, which is why they ship, and they are the class of defect a static read is worst at: `focus-not-restored` depends on what a component library does on unmount, not on what the calling code says.

## What it measures

Four things, from one traversal plus one dialog cycle:

1. The focus order, as a list of elements with their boxes, compared against DOM order.
2. Whether each focused element shows a visible indicator, decided by pixel delta.
3. Whether an open dialog holds focus and closes on Escape.
4. Where focus lands after the dialog closes.

## Recipe: the traversal

```js
await page.evaluate(() => document.body.focus());
const trail = [];
const limit = await page.evaluate(() =>
  document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]').length * 3 + 20);

for (let i = 0; i < limit; i++) {
  await page.keyboard.press('Tab');
  const step = await page.evaluate(() => {
    let el = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    if (!el || el === document.body) return { escaped: true };
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName, label: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 40),
      box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      inViewport: r.top >= 0 && r.bottom <= innerHeight,
    };
  });
  trail.push(step);
  if (trail.length > 2 && sameAs(step, trail[0])) break; // cycled back to the start
}
```

`sameAs` compares the recorded tag, label and box; the traversal stops when focus returns to where it started, and the cap catches the case where it never does.

Piercing shadow roots matters: a design system built on web components reports `document.activeElement` as the host for every step, and the traversal looks like one element repeating.

## Recipe: the focus indicator

Computed style cannot decide this. `outline: none` replaced by a `box-shadow` ring is a pass; a ring the same colour as the surface behind it is a fail, and both read identically in CSS. Compare pixels instead:

1. Screenshot the element's box padded by 6px while it is not focused.
2. Focus it with the keyboard, not `el.focus()`, so `:focus-visible` applies.
3. Screenshot the same region.
4. Fail when fewer than roughly 2% of pixels changed.

The keyboard detail is load-bearing. Programmatic focus does not match `:focus-visible` in Chromium, so a scripted `el.focus()` reports a missing ring on a control that has one.

## Recipe: the dialog cycle

Click the trigger, then assert in order: focus moved inside the dialog subtree; Tab from the last focusable element returns to the first rather than escaping to the page behind; Escape closes it; `document.activeElement` after close is the trigger element itself, not `body` and not the top of the document.

Record the trigger's selector before opening, since the element identity is what the restoration assertion needs.

## Paste and IME

Two assertions to run while the keyboard is already driving the page, since both are input handlers that look correct in source and fail at runtime.

Paste into every text field with `page.keyboard.press('Control+V')` after seeding the clipboard, then read the value back. A field that blocks paste (an `onPaste` preventing default, common on "confirm email" and card-number inputs) ends up empty, which is `forms-dont-block-paste-ime`.

For composition, dispatch `compositionstart`, `compositionupdate` and `compositionend` around a multi-character insertion and assert the committed value survived. A field that reformats or validates on every keystroke destroys an in-flight composition, so a Japanese or Korean user cannot type into it at all.

## Reading the result

| Observation | Rule id |
|---|---|
| `escaped: true` mid-traversal, before the cycle completed | `interaction-keyboard-operable` |
| Focus order diverges from visual reading order | `interaction-keyboard-operable` |
| Pixel delta under threshold on a focused control | `interaction-focus-visible` |
| Tab leaves an open modal, or Escape does not close it | `focus-broken-focus-trap` |
| Focus after close is not the trigger | `focus-not-restored` |
| New content rendered and focus stayed where it was | `focus-on-dynamic-content` |
| Focused element outside the viewport with no scroll | `interaction-focus-visible` |
| Pasted value did not land, or a composition was destroyed | `forms-dont-block-paste-ime` |

## False positives to guard

- **A skip link is invisible until focused and then appears at the top.** It reads as a focus-order anomaly on the first press and is correct.
- **An infinite or virtualised list** never cycles back within the limit. Cap the traversal and report the cap rather than a trap.
- **Custom widgets that use roving tabindex** (a toolbar, a listbox, a grid) intentionally expose one tab stop and move within it using arrow keys. Fewer tab stops than interactive elements is correct there; test the arrows before reporting an operability failure.
- **A dialog that intentionally returns focus elsewhere** after a destructive action (the trigger no longer exists) is correct. Fail only when focus went to `body` or the document top.

## Evidence to write

`focus-trail.json` with the full ordered list, the before and after crops for any indicator failure, and the pre-open and post-close `activeElement` for the dialog cycle.
