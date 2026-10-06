# Break Catalog

Worst-case values and the failure signatures they produce, grouped by what kind of value a component renders. Pull the rows that match the fields in your Phase 1 map; don't work through the whole file for a component that only renders three of these categories.

Adapted from Emil Kowalski's [break-ui](https://github.com/emilkowalski/skills/tree/main/skills/break-ui) skill (MIT licence). Credit his catalog and failure table; this file restates and reorganizes them in this repo's voice, it is not a copy.

Every value here is something a real user could produce, or the actual limit from a schema, column, or API contract, never a string chosen to be long for its own sake. Use `example.com` / `example.org` / `.test` for any email or URL in a fixture, so nothing ever points at a real inbox or site.

## Table of contents

- [Names and identity](#names-and-identity)
- [Unbreakable strings](#unbreakable-strings)
- [Labels and copy from data](#labels-and-copy-from-data)
- [Numbers and money](#numbers-and-money)
- [Collections](#collections)
- [Time](#time)
- [Images and media](#images-and-media)
- [States](#states)
- [Environment](#environment)
- [Failure signatures](#failure-signatures)
- [Truncate, wrap, or clamp](#truncate-wrap-or-clamp)

## Names and identity

| Value | Breaks |
| --- | --- |
| `Aleksandra Wiśniewska-Kowalczyk` | Long, hyphenated, diacritics; wraps, and the hyphen itself is a break point |
| `Christopher Alexander Montgomery III` | A naive first-plus-last initials rule reads the suffix as the last name |
| `Jo` / `J` | Two or one letters; near-empty name column, and a tiny click target if the name is also the link |
| `Ólafur Darri Ólafsson` | Leading accented capital; breaks case-folding and sort logic |
| `Đặng Thị Ngọc Hân` | Stacked diacritics clipped by a tight `line-height` plus `overflow: hidden` |
| `王秀英` | No spaces; "split on space, take the first word" initials logic finds one word |
| `نور الهدى عبد الرحمن` | RTL text; icons and punctuation land on the wrong side without `dir="auto"` |
| `María José de la Cruz y Fernández` | Lowercase particles; initials or "sort by last name" pick the wrong token |
| `🦊 Fox` / `👩🏽‍💻 Priya` | Emoji-led name; `.charAt(0)` or a naive `.length` slices a surrogate pair or ZWJ sequence into garbage |
| `  Sam   Lee  ` | Leading, trailing, doubled spaces; empty tokens, odd gaps in initials |
| *(missing)* | No name, only an email; the UI needs a defined fallback, not a blank |

## Unbreakable strings

Emails, URLs, and identifiers have no spaces, so a browser has no natural place to wrap them.

| Value | Breaks |
| --- | --- |
| `bartholomew.fitzgerald@northwind-industries-holdings.example.com` | Pushes every sibling off the row without `overflow-wrap: anywhere` |
| `a@b.co` | Shortest realistic email; a layout built assuming a long one looks sparse |
| `ops@sub.department.region.example.co.uk` | Many subdomains and a two-part TLD; breaks naive "domain" extraction |
| `https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments&filter=unresolved` | Long URL; end-truncation hides the part that actually differs between links |
| `9f8e7d6c-5b4a-4c3d-8e2f-1a0b9c8d7e6f` | UUID; fixed monospace width, a candidate for middle- rather than end-truncation |
| `Q3 Board Deck (FINAL, revised) v12 [approved by legal].pdf` | File name; end-truncation hides the version number |
| `IMG_20250914_183022_HDR_portrait_edited_edited.HEIC` | Camera file name; long, unbreakable, uppercase extension |

## Labels and copy from data

| Value | Breaks |
| --- | --- |
| `Senior Product Design Engineer, Platform Infrastructure` | Long job title wraps to three lines in a slot sized for one |
| `Benachrichtigungseinstellungen` | A single long compound word with no spaces; German and Dutch do this routinely |
| `Paramètres de confidentialité et de sécurité` | Translated copy runs ~30% longer than the English it replaced |
| Twelve tags on one item | Tag rows that wrap into a wall instead of collapsing to a `+8` |
| `Untitled` / empty string / `   ` | Missing title; a collapsed heading or a zero-height row |
| `<script>alert(1)</script>` / `&amp;` / `**bold**` | Must render as literal text; this is an escaping check, not a security pass |
| A 2,000-character pasted description | Clamping, "show more", and textarea growth all get exercised here |

## Numbers and money

| Value | Breaks |
| --- | --- |
| `0` | Zero states: "0 members", an empty progress bar, division by zero in a percentage |
| `1` | Pluralization: "1 members", "1 days ago" |
| `1284` | Needs a thousands separator |
| `12345678.9` as currency | Overflows a totals column once formatted |
| `-42.5` | Negative sign, color logic, parenthesized accounting format |
| `0.1 + 0.2` | `0.30000000000000004` rendered raw |
| `null` / `undefined` / `NaN` | Rendered literally instead of guarded |
| A value that changes live (`99` → `100`) | Width jump and digit jitter without `tabular-nums` |

## Collections

| Value | Breaks |
| --- | --- |
| 0 items | Whether an empty state exists at all |
| 1 item | A grid that looks broken with a single card; "1 of 1" copy |
| Page size, and page size + 1 | Off-by-one in "Showing 40 of 40", or a pagination control that offers an empty page 2 |
| 1,000+ items, unpaginated | Scroll performance and render time, not just layout |
| One item far larger than the rest | Masonry or grid rows stretched to the tallest item |

## Time

| Value | Breaks |
| --- | --- |
| Now | "0 seconds ago" instead of "just now" |
| 12 days, 11 months, 3 years ago | Relative-time thresholds that never switch to an absolute date |
| A future date | "in 3 days" rendered as "-3 days ago" |
| `1970-01-01` | A zero timestamp shown as a real date |
| A timestamp near midnight UTC | Shows as a different calendar day in UTC vs. the user's timezone |

Format with `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat`; hand-built time strings are where this category usually breaks.

## Images and media

| Value | Breaks |
| --- | --- |
| Avatar URL that 404s | A broken-image icon instead of the initials fallback |
| No avatar at all | The fallback itself: does it match the size and color of a real avatar |
| A 4000×200 panorama used as an avatar | Distortion without `object-fit: cover` |
| A transparent logo on a dark background | Invisible in dark mode |
| A slow-loading image | Layout shift with no fixed dimensions or `aspect-ratio` reserved |

## States

| Value | Breaks |
| --- | --- |
| Error from the API | No error state, or a raw `TypeError` shown to the user |
| Partial data | Some optional fields filled and others not, in the same list; misaligned rows |
| Every enum value at once | Status badges of varying width shown side by side |
| No permission | Whether a disabled action still lays out the same as an enabled one |
| The current user in the list | A "You" label, or an action that shouldn't apply to yourself |

## Environment

Not data, but checked the same way: hold the worst case steady and change these.

| Condition | Breaks |
| --- | --- |
| Container at 320px | Every overflow above, at once |
| A narrow sidebar placement | A component designed full-width, reused in a narrow column |
| Browser zoom at 200% | Fixed heights that clip text as it grows |
| Dark mode | Hardcoded colors, invisible borders and logos |
| `dir="rtl"` | Icons, chevrons, padding, and trailing-action order |
| Touch device | Hover-only actions (a `...` menu that appears on hover) become unreachable |

## Failure signatures

What a screenshot shows, the CSS cause behind it, and the fix. Most breaks trace to one row here.

| What you see | Cause | Fix |
| --- | --- | --- |
| Avatar or icon squished into an oval | A flex child shrinking | `flex-shrink: 0` on the avatar, icon, or any fixed-size box |
| Text overflows its box instead of wrapping | `min-width: auto` on a flex or grid child | `min-width: 0` on the text column (`minmax(0, 1fr)` in grid) |
| Email or URL runs past the edge | No break opportunity in the string | `overflow-wrap: anywhere` on that element |
| Trailing action pushed off-screen or clipped | The middle content took all the available space | `min-width: 0` on the middle, `flex-shrink: 0` on the action |
| Badge wraps onto two lines | Badge allowed to shrink | `white-space: nowrap; flex-shrink: 0`, and decide what yields instead |
| Avatar looks adrift against a wrapped multi-line name | `align-items: center` on rows of varying height | `align-items: flex-start` once text can wrap |
| Last row cut off mid-glyph | Fixed-height container with no scroll affordance | A visible scrollbar or fade mask, and an intended `overflow` |
| Long word breaks mid-word | `word-break: break-all` | `overflow-wrap: anywhere`, which only breaks when it has to |
| Wrong initials (`J` for "Jo", garbled for an emoji name) | `.split(' ')[0][0]`-style slicing | Initials from grapheme clusters (`Intl.Segmenter`), with a fallback icon |
| Orphaned dash or blank line where a field was | A placeholder rendered for a missing optional value | Omit the line, or reserve its height on purpose |
| "1 members", "0 member" | A hardcoded plural | `Intl.PluralRules`, or separate strings per count |
| Numbers jitter and columns misalign | Proportional figures | `font-variant-numeric: tabular-nums` |
| Raw `1284`, `NaN`, or `undefined` on screen | An unformatted number rendered directly | `Intl.NumberFormat`, with a null guard |
| A translated button label overflows | A fixed-width button | Width from content, with `min-width` rather than a fixed `width` |
| Diacritics or tall scripts clipped top or bottom | Tight `line-height` with `overflow: hidden` | Looser `line-height`, or no clipping on text boxes |
| Scrolling a long list stutters | Every row rendered at once | Virtualize or paginate, and say which |
| Raw `<b>`, `&amp;`, or `**text**` on screen | The wrong escaping layer, or `dangerouslySetInnerHTML` on user data | Escape once, at render |

## Truncate, wrap, or clamp

Every long string forces this choice, made per field, not globally:

- **Wrap** text the user needs in full to identify something: names, titles in a detail view.
- **Truncate at the end** for secondary metadata where the start carries the meaning: a role, a description preview.
- **Truncate in the middle** when items differ at the end, not the start: file names, emails on a shared domain, hashes. End-truncation makes them look identical.
- **Clamp** (`line-clamp: 2`) for multi-line previews in cards, to keep card heights predictable.
- **Never truncate** numbers, amounts, dates, or anything the user compares.
