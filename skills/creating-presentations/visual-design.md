# Visual Design

Dark-first, high contrast, minimal. Impact comes from scale and weight, not decoration.

## Core style

| Element | Spec |
|---------|------|
| Background | #000000 or zinc-900 (#18181b) |
| Text primary | #FFFFFF |
| Text secondary | #9CA3AF |
| Accents | Section colors (see [outline-structure.md](outline-structure.md)) |
| Font | Sans-serif (Geist Sans, Inter, or system) |
| Code font | JetBrains Mono or Fira Code |
| Letter spacing | Headlines: -0.035em to -0.015em. All caps labels: tracked wide |

## Typography hierarchy

Impact through **scale, not weight**. Use light/regular weights (400–600) at large sizes.

| Level | Size | Weight | Color | Use |
|-------|------|--------|-------|-----|
| Section label | 14–16px | 600, all caps | Section accent color | Top-left, signals current section |
| Headline | 48–72px | 400–500 | Primary (#FFF) | One idea, 1–5 words per line |
| Subtitle | 24–32px | 400 | Secondary (#9CA3AF) | 1–2 lines max |
| Body/bullets | 20–24px | 400–500 | Primary or secondary | Bold lead-ins at 600 weight |
| Caption | 14–16px | 400 | Muted | Footnotes, sources |

## Text contrast hierarchy

| Level | Purpose | Color |
|-------|---------|-------|
| Primary | Headlines, key content | #FFFFFF |
| Secondary | Subtitles, supporting text | Light gray |
| Muted | Labels, metadata | Medium gray (#9CA3AF) |
| Faint | Background elements, dividers | Dark gray |

## Layout patterns

### Full statement (most common)
```
┌─────────────────────────────────────────┐
│ SECTION LABEL                           │
│                                         │
│ Massive                                 │
│ Headline                                │
│ Here                                    │
│                                         │
│ Subtitle text in muted color            │
└─────────────────────────────────────────┘
```

### Big statement (maximum impact)
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│       Even Bigger                       │
│       Statement                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

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

### Section divider (with gradient)
```
┌────────────────────┬────────────────────┐
│                    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ Section            │▓▓▓ Gradient ▓▓▓▓▓▓▓│
│ Title              │▓▓▓ Background ▓▓▓▓▓│
│                    │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ Subtitle           │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
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
- **Gradients**: aurora-style using section color, subtle (0.1–0.2 opacity)
- **Icons**: simple line icons, white or accent, used sparingly

## Avoid

- Light backgrounds (breaks the system)
- Heavy font weights for headlines (use scale instead)
- More than 4–5 bullet points per slide
- Multiple competing focal points
- Dense paragraphs of text
- Animation for animation's sake
