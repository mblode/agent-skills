# Probe: theme and locale matrix

Captures the same route across viewport, theme, string length, and text direction. `dark-i18n-untested` and `dark-i18n-rtl-untested` default to backlog precisely because nobody has looked; this probe is the looking.

## What it measures

The matrix is viewport x theme, with two extra passes layered on the widest and narrowest widths:

| Axis | Values |
|---|---|
| Viewport | 360x800 with touch, 1280x800 |
| Theme | light, dark |
| Locale | source strings, pseudo-locale (expanded) |
| Direction | `ltr`, `rtl` |

Eight captures for the base matrix is the useful default. The full cross product is sixteen and mostly redundant: run the pseudo-locale and RTL passes at one width each unless the base matrix already showed an edge.

## Setting the theme, correctly

```js
await page.emulateMedia({ colorScheme: 'dark' });
```

This is the whole fix only for an app themed purely by `prefers-color-scheme`. Most Tailwind apps toggle a `class="dark"` or `data-theme` attribute on `<html>`, and for those the media emulation changes nothing while the probe reports a clean dark pass it never took. Drive the app's own control, then assert:

```js
const applied = await page.evaluate(() =>
  document.documentElement.className + '|' + (document.documentElement.dataset.theme ?? ''));
```

If neither the class nor the attribute changed, the theme did not apply and the capture is `unknown`, not a dark-mode pass. Where the app persists the choice, setting `localStorage` before the first navigation is more reliable than clicking a toggle that may be inside a menu.

Run `probes/axe-scan.md` at each theme. Contrast is the finding this matrix exists to produce, and it is computed there.

## Pseudo-locale

Where the app has an i18n layer, switch to a pseudo-locale it supports, or intercept the message bundle and transform the values: accent the letters so untranslated strings stand out, and pad to roughly 140% of the source length so the layout meets the German and Finnish case.

Where it has no i18n layer, expand in the DOM as `probes/viewport-stress.md` does, and say in the report that the expansion was applied post-render. The two are not equivalent: a DOM pass cannot reach text drawn into a canvas, placeholder attributes, or strings a later render replaces.

What the pass is looking for is layout failure, not prose: buttons that grow past their container, labels that clip, nav items that wrap into two rows and push the header taller, tabs that overflow with no scroll affordance.

## RTL

```js
await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
```

Then re-run the overflow check from `probes/viewport-stress.md` and capture. Physical properties are what break: `margin-left`, `left`, `text-align: left`, `border-l`, and a `translateX` that assumes one direction. They show up as elements crowding the wrong edge, icons on the wrong side of their label, and drawers sliding in from the wrong side.

Setting `dir` on the document does not translate anything, so read the capture for geometry only. A layout that mirrors cleanly passes even with the source strings still in English.

## Reading the result

| Observation | Rule id |
|---|---|
| Theme attribute never changed | `unknown`, reason `theme-not-applied`. Never a pass |
| axe `color-contrast` violations present in dark and absent in light | `dark-i18n-untested`, `reproduced` |
| Hardcoded light surface visible in the dark capture (a white card, a black-on-dark icon) | `dark-i18n-untested` |
| Overflow or clipping under the pseudo-locale that is absent at source length | `dark-i18n-untested` at the layout end; report the element |
| Elements crowding the wrong edge under `dir=rtl` | `dark-i18n-rtl-untested` |

An app with no dark theme at all is not a finding here. Report it as not applicable and move on; whether the product should have one is a `product-design` question.

## False positives to guard

- **A capture taken before the theme transition finished** shows a half-swapped page. Wait for the transition, or disable transitions for the capture.
- **Images and illustrations authored for one theme** are a real finding but not a CSS one; the fix is a second asset, so report it with the capture rather than as a token defect.
- **RTL on a page of source-language prose** legitimately left-aligns paragraphs in some designs. Judge chrome and controls, not body copy.
- **Pseudo-locale expansion inside a fixed-width design that was never meant to localise.** Check whether the product ships other locales before reporting expansion failures at full severity.

## Evidence to write

`<route>-<width>-<theme>.png` for the base matrix, plus `<route>-pseudo.png` and `<route>-rtl.png`. Keep the naming mechanical: this probe's output is compared across runs more than any other, and a matrix whose filenames drift cannot be diffed.
