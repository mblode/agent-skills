# Probe: target size

Measures the real hit area of every visible interactive element at a touch viewport, so `interaction-target-size` stops being a guess about class names.

The static rule greps for small sizing classes and cannot see three things that decide the finding: a pseudo-element that expands the hit area, a transparent overlay that owns the click, and padding on an ancestor that is the actual target. All three are common in shipped component libraries, and all three make the static hit a false positive.

## What it measures

Per element: the bounding box, and the *effective* hit area found by hit-testing. An element passes when a 44x44 CSS px box centred on it resolves to that element or one of its descendants at all four corners.

## Recipe

Run at a touch viewport (360x800, `hasTouch: true`, `isMobile: true`). The 44px floor is a touch threshold; measuring it under a fine pointer reports desktop-dense UI as broken.

```js
const results = await page.evaluate(() => {
  const SEL = 'a[href], button, input:not([type=hidden]), select, textarea, summary,' +
    '[role=button], [role=link], [role=checkbox], [role=radio], [role=switch],' +
    '[role=tab], [role=menuitem], [role=option], [tabindex]:not([tabindex="-1"])';
  const out = [];
  for (const el of document.querySelectorAll(SEL)) {
    if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const half = 22;
    const corners = [[-half, -half], [half, -half], [-half, half], [half, half]];
    const covered = corners.every(([dx, dy]) => {
      const hit = document.elementFromPoint(cx + dx, cy + dy);
      return hit && (hit === el || el.contains(hit) || hit.contains(el));
    });
    out.push({
      selector: cssPath(el),
      text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 40),
      box: { w: Math.round(r.width), h: Math.round(r.height) },
      effective44: covered,
      inProse: !!el.closest('p, li, td, [class*=prose]'),
    });
  }
  return out;
});
```

`cssPath` is any stable selector serialiser; the path only has to be good enough for a human to find the element again.

## Reading the result

| Condition | Result |
|---|---|
| `box` under 44 on either axis AND `effective44` false | `reproduced`, fail |
| `box` under 44 but `effective44` true | `not-reproduced`; the hit area is expanded. Record both numbers |
| `box` between 44 and 47 | pass with a note. 48 is the build target, 44 is the conformance floor |
| `inProse` true | Skip. WCAG 2.5.8 exempts inline links in a sentence |

Report `observed: { width, height, effectiveHitArea }` and the viewport. A finding without the viewport is not reproducible, because the same control legitimately measures differently under `pointer: fine`.

## Hover-only affordances

The same enumeration settles `mobile-hover-only-affordance`, because both questions are "can a touch user reach this control". Record the visible interactive set at the touch viewport, then dispatch a synthetic `pointerover` and `mouseover` over each container and record it again. Controls that appear only in the second set are reachable by pointer and not by touch.

The static rule catches `group-hover:opacity-100` and its relatives. What it cannot see is a control revealed by JavaScript on hover, or one revealed on hover and also on focus, which is the correct pattern and reads identically to the broken one until the page runs.

## False positives to guard

- **Corner hit-testing catches its own overlay.** A full-page modal backdrop or a sticky header sitting over the control returns the overlay at every corner, so `effective44` reads false for a control that is fine. Scroll the element into view and dismiss transient chrome before measuring.
- **Elements inside a closed menu, drawer, or tab panel** are visible to the selector but not to the user. `checkVisibility` handles `display: none` and `visibility: hidden`, not a panel positioned off-canvas: filter boxes whose centre falls outside the viewport.
- **Controls that are decoration.** `pointer-events: none` elements match the role selectors but take no input. Check the computed value before measuring.
- **A repeated component reports once per instance.** Twenty table rows with the same undersized icon button is one finding with a count, not twenty findings.

## Evidence to write

`target-size.json` with the full element list, and one annotated screenshot per failing element (the viewport capture is enough; a crop around the control is better). Keep the passing rows in the JSON: they are what makes a `not-reproduced` result checkable.
