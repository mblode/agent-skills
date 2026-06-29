# Visual Design

Dark-first, high contrast, minimal. Impact comes from scale, not decoration.

## Contents

- [Core style](#core-style)
- [Typography hierarchy](#typography-hierarchy)
- [Layout patterns](#layout-patterns)
- [Slide type to layout mapping](#slide-type--layout-mapping)
- [Visual elements](#visual-elements)
- [Avoid](#avoid)

## Core style

| Element | Spec |
|---------|------|
| Background | #000000 or zinc-900 (#18181b) |
| Text primary | #FFFFFF |
| Text secondary / muted | #9CA3AF (one canonical name for both) |
| Accents | Section colors (see [outline-structure.md](outline-structure.md)) |
| Font | Sans-serif (Geist Sans, Inter, or system) |
| Code font | JetBrains Mono or Fira Code |
| Letter spacing | Headlines: -0.035em to -0.015em. All caps labels: tracked wide |

## Typography hierarchy

Impact through **scale, not weight**: light/regular weights (400-600) at large sizes.

| Level | Size | Weight | Color | Use |
|-------|------|--------|-------|-----|
| Section label | 14-16px | 600, all caps | Section accent color | Top-left, signals current section |
| Headline | 48-72px | 400-500 | Primary (#FFF) | One idea, 1-5 words per line |
| Subtitle | 24-32px | 400 | Secondary (#9CA3AF) | 1-2 lines max |
| Body/bullets | 20-24px | 400-500 | Primary or secondary | Bold lead-ins at 600 weight |
| Caption | 14-16px | 400 | Muted (#9CA3AF) | Footnotes, sources |

## Layout patterns

Statement, big-statement, and section-divider layouts follow the [mapping table](#slide-type--layout-mapping) (label top-left, headline scaled to fill, subtitle muted). Diagrams below cover only layouts with real spatial arrangement.

### Split layout (text + content)
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
| section-divider | Section divider with accent gradient |
| goals, recap | Split layout or full statement with bullets |
| data | Data/metrics grid |
| code | Code slide with syntax highlighting |
| quote | Big statement with attribution below |
| resources | Grouped links, split layout |

## Visual elements

- **Section labels**: top-left, all caps, accent color, tracked wide
- **Progress bar**: bottom edge, section color, thin (3px)
- **References**: bottom footer, clickable URLs, muted color
- **Gradients**: aurora-style in section color, subtle (0.1-0.2 opacity)
- **Icons**: simple line icons, white or accent, used sparingly

## Avoid

- Light backgrounds (breaks the system)
- Heavy font weights for headlines (use scale)
- More than 4-5 bullets per slide
- Multiple competing focal points
- Dense paragraphs
- Animation for its own sake
