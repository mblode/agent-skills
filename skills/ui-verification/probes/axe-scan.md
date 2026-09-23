# Probe: axe scan

Injects axe-core into the loaded page and collects WCAG violations per route and per theme. This is the probe that finally computes contrast, which the whole rules corpus defers on because contrast is a property of two rendered colours and not of a hex value in a class string.

## What it measures

Every axe rule in the WCAG 2.0, 2.1 and 2.2 A and AA tag sets, against the DOM as it actually rendered: after hydration, after the theme applied, with real computed colours including whatever a background image or a translucent overlay contributed.

Run it once per theme. A palette that passes in light and fails in dark is the single most common contrast defect, and a single-theme scan reports it as clean.

## Recipe

```js
import AxeBuilder from '@axe-core/playwright';

const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
  .exclude('iframe[src*="stripe"], iframe[src*="youtube"], [data-consent-banner]')
  .analyze();
```

Without the Playwright integration, load `axe.min.js` into the page and call `axe.run(document, { runOnly: { type: 'tag', values: [...] } })`. The results object is identical.

Wait for the page to settle first: a scan fired before hydration reports missing labels on controls that are about to receive them. Wait for the route's primary content selector, not a fixed timeout.

## Mapping violations to rule ids

Emit each violation under the ui-design rule it corresponds to, so the finding joins the existing corpus rather than arriving as a parallel report:

| axe violation id | Rule id |
|---|---|
| `color-contrast`, `color-contrast-enhanced` | no static rule; emit as `axe:color-contrast` with the theme in `observed` |
| `image-alt`, `role-img-alt`, `input-image-alt` | `a11y-image-alt-text` |
| `button-name`, `link-name`, `aria-command-name` | `a11y-icon-controls-labeled` |
| `label`, `form-field-multiple-labels`, `select-name` | `forms-labels-and-autocomplete` |
| `html-has-lang`, `html-lang-valid`, `valid-lang` | `a11y-document-language` |
| `th-has-data-cells`, `td-headers-attr`, `table-fake-caption` | `a11y-data-table-semantics` |
| `heading-order`, `region`, `landmark-one-main`, `bypass` | `a11y-skip-link-heading-order` |
| `video-caption`, `audio-caption` | `a11y-media-captions` |
| `aria-*` structural rules, `nested-interactive`, `list` | `a11y-semantic-html-first` |

Anything not in the table keeps its axe id under `axe:<id>`. Do not invent a rule id to make a violation look like corpus output.

## What axe does not settle

- **Colour as the only carrier of meaning.** axe computes contrast, not semantics: a red border and a green border both pass contrast while being indistinguishable to a viewer who cannot tell them apart. For `a11y-color-only-meaning`, check that each status element carries a non-colour differentiator (an icon, a glyph, or a word) inside its accessible name, and capture the page with `filter: grayscale(1)` on the root as evidence for a human. The grayscale capture is evidence, not a verdict.
- **Whether the accessible name is any good.** `button-name` passes on `aria-label="button"`. Read the names the scan returns and flag the useless ones.
- **Focus order and restoration.** axe checks landmarks and tab indexes, never where focus went after an action. That is `probes/focus-walk.md`.

## False positives to guard

- **Third-party iframes.** Payment fields, embedded players and consent banners produce violations nobody in this repo can fix. Exclude by frame and say so in the report.
- **Colour contrast on text over an image or a gradient** returns `incomplete`, not `violation`, because axe cannot sample the backdrop. Treat `incomplete` as its own bucket: report the elements and capture them, never fold them into the violation count.
- **Elements hidden behind a closed disclosure** are in the DOM and scanned. Scan the open state deliberately rather than counting the closed one.

## Evidence to write

The raw axe results JSON per route and theme (`axe-<route>-<theme>.json`), the violation count by impact, and a capture of the theme that failed. Keep `incomplete` entries in the file; they are the queue for a human.
