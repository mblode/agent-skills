# Visual Design

High contrast, minimal, impact from scale rather than decoration. Two colour systems, one type system, one set of layouts.

## Contents

- [Pick a colour system](#pick-a-colour-system)
- [Contrast thresholds](#contrast-thresholds)
- [Full-bleed palettes](#full-bleed-palettes)
- [Dark with section accents](#dark-with-section-accents)
- [Typography hierarchy](#typography-hierarchy)
- [Layout patterns](#layout-patterns)
- [Slide type to layout mapping](#slide-type-to-layout-mapping)
- [Visual elements](#visual-elements)
- [Avoid](#avoid)

## Pick a colour system

Decide once, at the start of the design step, and hold it for the whole deck.

| System | Use it when | How the audience tracks position |
|--------|-------------|----------------------------------|
| **Full-bleed palettes** | The deck has a visual identity of its own, or covers distinct products, tools, or chapters that each own a colour | The whole screen changes |
| **Dark with section accents** | Technical content, heavy code and data, a dark room or large hall, or a house template you have to live inside | An accent colour changes |

Dark with accents is the default and never looks wrong in a dark room. Full-bleed is the bolder choice and the harder one to execute, because every pairing has to carry body text at real contrast.

The venue overrides the default. Duarte's rule of thumb: dark backgrounds suit formal settings and large venues where the screen glows; light backgrounds suit small bright rooms and anything that doubles as a handout. A dark deck on a weak projector in daylight goes grey, and white body text disappears into it. When Step 1 says bright room, run the dark system's roles inverted (paper `#f6ebd9` or white background, near-black `#211f1e` text, the same section accents) or pick the full-bleed paper pair for most slides.

## Contrast thresholds

WCAG 1.4.3, applied to slides: 4.5:1 between text and background for normal text, 3:1 for large text, where large means at least 18pt (24px) or 14pt (18.66px) bold. In practice only headlines and big statements qualify as large; body, bullets, captions, and code all need 4.5:1. Measure from the hex values, not from how it looks on your screen, and check the smallest text on the slide. A pair that passes at headline size and fails at caption size is a failing pair.

Projection is harsher than the standard assumes. Ambient light lifts the black level, so treat 4.5:1 as the floor and prefer 7:1 for body text on the dark system (`#FFFFFF` on `#000000` is 21:1; `#9CA3AF` muted on `#18181b` is 7.0:1).

## Full-bleed palettes

One palette owns the entire slide. Background, foreground, and the muted tone all come from the same pair. There is no accent colour, because the slide is the accent.

Drive it from a data attribute so a slide declares its palette and nothing else has to know:

```css
[data-palette="rust"] {
  --bg: #e54f11;
  --fg: #ffffc2;
  --fg-soft: color-mix(in oklab, var(--fg) 80%, var(--bg));
  --hairline: color-mix(in oklab, var(--fg) 22%, var(--bg));
}
```

Derive the muted tone with `color-mix` against the background, not with opacity. Opacity muddies against a saturated background and gives you a different hue on every slide.

Pairs that hold up at display size, with the body-text contrast you are working with:

| Background | Foreground | Ratio | Reads as |
|------------|------------|-------|----------|
| `#e54f11` | `#ffffc2` | 3.7:1 | Rust on cream, loud. Headlines only; body text fails 4.5:1, so keep captions off this slide or lift the foreground |
| `#f6ebd9` | `#514733` | 7.7:1 | Paper, the quiet slide between loud ones, and the bright-room fallback |
| `#0c90d2` | `#aeffff` | 3.1:1 | Blue on cyan, high energy. Headline slides only |
| `#211f1e` | `#f6ebd9` | 13.9:1 | Near-black on warm white, the workhorse |
| `#efee77` | `#000000` | 17.2:1 | Yellow, use once |

Rules that keep it coherent:

- **A subject keeps its palette.** Every slide about one product, tool, or chapter uses the same pair. That run of colour is the wayfinding.
- **Loud, then quiet.** Two saturated slides in a row exhaust the room. Put a paper or near-black slide between them.
- **The loud pairs carry headlines, the quiet pairs carry body.** Rust and blue sit under 4.5:1 and belong on statement and divider slides; anything with bullets or captions goes on paper or near-black.
- **Borders come from the pair.** A hairline is `--fg` mixed into `--bg`, never a grey.

## Dark with section accents

The alternative system. Black or zinc-900 throughout, white text, one accent per major section.

| Element | Spec |
|---------|------|
| Background | `#000000` or zinc-900 (`#18181b`) |
| Text primary | `#FFFFFF` |
| Text secondary / muted | `#9CA3AF` (7.0:1 on zinc-900, 9.0:1 on black) |
| Accents | Section colours, listed with the section table in outline-structure.md; all seven sit above 7.5:1 on black and 6.4:1 on zinc-900, so an accent can carry a headline or a bold lead-in, but muted `#9CA3AF` stays the caption colour |
| Font | Sans-serif (Geist Sans, Inter, or system) |
| Code font | JetBrains Mono or Fira Code |
| Letter spacing | Headlines: -0.035em to -0.015em. All caps labels: tracked wide |

One accent per major section, teal reused for opening and closing. An accent that appears mid-section reads as a topic change that never happened.

## Typography hierarchy

Impact through **scale, not weight**: light and regular weights at large sizes beat small bold type.

### Fluid scale (web deck)

Size in `clamp()`, not fixed pixels. A deck is presented on a projector, reviewed on a laptop, and forwarded to a phone; a fixed 72px headline is a different slide on each.

```css
--slide-text-sm:      clamp(12px, 0.8vw, 16px);
--slide-text-base:    clamp(14px, 0.95vw, 20px);
--slide-text-lg:      clamp(16px, 1.1vw, 24px);
--slide-text-2xl:     clamp(22px, 1.6vw, 36px);
--slide-text-4xl:     clamp(34px, 2.5vw, 56px);
--slide-text-6xl:     clamp(56px, 5vw, 110px);
--slide-text-display: clamp(64px, 9vw, 200px);
```

### Fixed canvas (Marp, Slidev export, .pptx)

A 16:9 canvas is 1280x720 in Marp and 13.33x7.5in in PowerPoint, so sizes are absolute. Translate the steps:

| Level | Fluid step | Marp px | PowerPoint pt |
|-------|-----------|---------|---------------|
| Caption / section label | `sm` | 16-18 | 12-14 |
| Body / bullets | `lg` | 24-28 | 18-24 |
| Subtitle | `2xl` | 32-36 | 24-28 |
| Headline | `4xl` to `6xl` | 56-96 | 40-66 |
| Big statement | `display` | `<!-- fit -->` | 80+ |

Two floors: Kawasaki's 30pt for body text on a presented pitch in a large room, 18pt for a deck read at a desk.

### Levels

| Level | Weight | Colour | Use |
|-------|--------|--------|-----|
| Section label | 600, all caps | Accent or `--fg-soft` | Top-left, signals current section |
| Headline | 400-500 | `--fg` | One idea, 1-5 words per line |
| Big statement | 400-500 | `--fg` | One or two per deck, no more |
| Subtitle | 400 | `--fg-soft` | 1-2 lines max |
| Body / bullets | 400-500 | `--fg` or `--fg-soft` | Bold lead-ins at 600 |
| Caption | 400 | `--fg-soft` | Footnotes, sources |

Set headlines with `text-wrap: balance`, `line-height` near 0.95, and negative tracking around -0.025em. At display size the default line-height leaves a hole in the middle of the slide.

A variable typeface earns its place here: animating weight and tracking as a headline settles is the one motion effect that reads as craft rather than decoration.

## Layout patterns

Statement, big-statement, and section-divider layouts follow the [mapping table](#slide-type-to-layout-mapping): label top-left, headline scaled to fill, subtitle muted. The diagrams below cover only layouts with real spatial arrangement.

### Split layout (text + content)

Asymmetric ratios read better than 50/50. Pick from a fixed set (60/40, 70/30, 40/60, 30/70) so the deck stays consistent, with an optional hairline between columns.

```
┌────────────────────┬────────────────────┐
│                    │                    │
│ Headline           │  • Point one       │
│ Here               │  • Point two       │
│                    │  • Point three     │
│ Subtitle           │                    │
└────────────────────┴────────────────────┘
```

### Code slide
```
┌─────────────────────────────────────────┐
│ Headline                                │
│ Subtitle                                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ // syntax-highlighted code block    │ │
│ │ const result = await generate()     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Data/metrics
```
┌─────────────────────────────────────────┐
│        ┌────────┐ ┌────────┐ ┌────────┐ │
│        │  $10M  │ │  ~10%  │ │  NPS   │ │
│        │  ARR   │ │ GROWTH │ │   90   │ │
│        └────────┘ └────────┘ └────────┘ │
│ Headline                                │
│ Subtitle                                │
└─────────────────────────────────────────┘
```

## Slide type to layout mapping

| Slide type | Layout |
|------------|--------|
| statement | Full statement, left-aligned |
| big-statement | Big statement, centered |
| question | Full statement, centered |
| section-divider | Full-bleed palette change, or accent gradient on the dark system |
| goals, recap | Split layout or full statement with bullets |
| data | Data/metrics grid; the chart itself is `dataviz` territory where that skill is installed |
| code | Code slide with syntax highlighting |
| demo | Full-bleed, the running thing, minimal chrome |
| quote | Big statement with attribution below |
| resources | Grouped links, split layout |

Vary the layout when the slide's job changes. A section that is genuinely a list of three parallel points can hold one layout for three slides; a deck that holds one layout for ten has stopped signalling anything.

## Visual elements

- **Section labels**: top-left, all caps, tracked wide
- **Oversized numerals**: the slide number set large in `--fg-soft` as marginalia, a cheap way to fill a corner without decoration
- **Pill labels**: outlined or solid, drawn from `--fg`, for a category or a product name
- **Progress bar**: bottom edge, thin (3px)
- **References**: bottom footer, clickable URLs, muted
- **Icons**: simple line icons, `--fg` or accent, used sparingly

## Avoid

- A palette pair that fails 4.5:1 at body size because it passed at headline size
- Opacity where `color-mix` against the background belongs
- Heavy font weights for headlines (use scale)
- Fixed pixel type in a web deck that will be viewed at more than one size
- Mixing the two colour systems: an accent colour on a full-bleed palette slide
- Multiple competing focal points
- Dense paragraphs
- Animation for its own sake
