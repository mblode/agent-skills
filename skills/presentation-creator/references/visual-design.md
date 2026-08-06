# Visual Design

High contrast, minimal, impact from scale rather than decoration. Two colour systems, one type system, one set of layouts.

## Contents

- [Pick a colour system](#pick-a-colour-system)
- [Full-bleed palettes](#full-bleed-palettes)
- [Dark with section accents](#dark-with-section-accents)
- [Typography hierarchy](#typography-hierarchy)
- [Layout patterns](#layout-patterns)
- [Slide type to layout mapping](#slide-type--layout-mapping)
- [Visual elements](#visual-elements)
- [Avoid](#avoid)

## Pick a colour system

Decide once, at the start of the design step, and hold it for the whole deck.

| System | Use it when | How the audience tracks position |
|--------|-------------|----------------------------------|
| **Full-bleed palettes** | The deck has a visual identity of its own, or covers distinct products, tools, or chapters that each own a colour | The whole screen changes |
| **Dark with section accents** | Technical content, heavy code and data, or a house template you have to live inside | An accent colour changes |

Full-bleed is the bolder choice and the harder one to execute, because every pairing has to carry body text at real contrast. Dark with accents is the safe default and never looks wrong.

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

Pairs that hold up at display size:

| Background | Foreground | Reads as |
|------------|------------|----------|
| `#e54f11` | `#ffffc2` | Rust on cream, loud, good for an opening |
| `#f6ebd9` | `#514733` | Paper, the quiet slide between loud ones |
| `#0c90d2` | `#aeffff` | Blue on cyan, high energy |
| `#211f1e` | `#f6ebd9` | Near-black on warm white, the workhorse |
| `#efee77` | `#000000` | Yellow, use once |

Rules that keep it coherent:

- **A subject keeps its palette.** Every slide about one product, tool, or chapter uses the same pair. That run of colour is the wayfinding.
- **Loud, then quiet.** Two saturated slides in a row exhaust the room. Put a paper or near-black slide between them.
- **Contrast is not optional.** Check every pair at body size, not just at display size. Saturated on saturated can pass at 100px and fail at 20px; if the caption is unreadable, the pair is wrong even though the headline looks great.
- **Borders come from the pair.** A hairline is `--fg` mixed into `--bg`, never a grey.

## Dark with section accents

The alternative system. Black or zinc-900 throughout, white text, one accent per major section.

| Element | Spec |
|---------|------|
| Background | `#000000` or zinc-900 (`#18181b`) |
| Text primary | `#FFFFFF` |
| Text secondary / muted | `#9CA3AF` |
| Accents | Section colors, listed with the section table in outline-structure.md |
| Font | Sans-serif (Geist Sans, Inter, or system) |
| Code font | JetBrains Mono or Fira Code |
| Letter spacing | Headlines: -0.035em to -0.015em. All caps labels: tracked wide |

One accent per major section, teal reused for opening and closing. An accent that appears mid-section reads as a topic change that never happened.

## Typography hierarchy

Impact through **scale, not weight**: light and regular weights at large sizes beat small bold type.

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

| Level | Step | Weight | Color | Use |
|-------|------|--------|-------|-----|
| Section label | `sm` | 600, all caps | Accent or `--fg-soft` | Top-left, signals current section |
| Headline | `4xl` to `6xl` | 400-500 | `--fg` | One idea, 1-5 words per line |
| Big statement | `display` | 400-500 | `--fg` | One or two per deck, no more |
| Subtitle | `2xl` | 400 | `--fg-soft` | 1-2 lines max |
| Body / bullets | `lg` | 400-500 | `--fg` or `--fg-soft` | Bold lead-ins at 600 |
| Caption | `sm` | 400 | `--fg-soft` | Footnotes, sources |

Set headlines with `text-wrap: balance`, `line-height` near 0.95, and negative tracking around -0.025em. At display size the default line-height leaves a hole in the middle of the slide.

A variable typeface earns its place here: animating weight and tracking as a headline settles is the one motion effect that reads as craft rather than decoration.

## Layout patterns

Statement, big-statement, and section-divider layouts follow the [mapping table](#slide-type--layout-mapping): label top-left, headline scaled to fill, subtitle muted. The diagrams below cover only layouts with real spatial arrangement.

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

## Slide type → layout mapping

| Slide type | Layout |
|------------|--------|
| statement | Full statement, left-aligned |
| big-statement | Big statement, centered |
| question | Full statement, centered |
| section-divider | Full-bleed palette change, or accent gradient on the dark system |
| goals, recap | Split layout or full statement with bullets |
| data | Data/metrics grid |
| code | Code slide with syntax highlighting |
| demo | Full-bleed, the running thing, minimal chrome |
| quote | Big statement with attribution below |
| resources | Grouped links, split layout |

## Visual elements

- **Section labels**: top-left, all caps, tracked wide
- **Oversized numerals**: the slide number set large in `--fg-soft` as marginalia, a cheap way to fill a corner without decoration
- **Pill labels**: outlined or solid, drawn from `--fg`, for a category or a product name
- **Progress bar**: bottom edge, thin (3px)
- **References**: bottom footer, clickable URLs, muted
- **Icons**: simple line icons, `--fg` or accent, used sparingly

## Avoid

- A palette pair that fails contrast at body size because it passed at headline size
- Opacity where `color-mix` against the background belongs
- Heavy font weights for headlines (use scale)
- Fixed pixel type in a deck that will be viewed at more than one size
- Mixing the two colour systems: an accent colour on a full-bleed palette slide
- Multiple competing focal points
- Dense paragraphs
- Animation for its own sake
