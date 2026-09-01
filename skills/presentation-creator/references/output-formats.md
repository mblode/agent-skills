# Output Formats

Emit the finished deck. Marp markdown is the default; Slidev and reveal.js are the swaps when the user already runs one; a `.pptx` is a handoff to the external `pptx` skill. Read this at Step 7, once copy and notes exist.

## Contents

- [Pick a format](#pick-a-format)
- [Marp (default)](#marp-default)
- [Slidev](#slidev)
- [reveal.js](#revealjs)
- [Handing off to the pptx skill](#handing-off-to-the-pptx-skill)
- [Gotchas](#gotchas)

## Pick a format

| Situation | Format |
|-----------|--------|
| No format named, no live demo needed | Marp markdown: one `.md` file, renders to HTML, PDF, and PPTX, previews in VS Code |
| The user already has a Slidev or reveal.js deck, or wants Vue components on slides | Match what they run; syntax below |
| A live demo, a playground, or a deck that lives at a URL | Web app, `web-deck.md` |
| The user names a `.pptx` or `.potx`, or must edit in PowerPoint or Keynote | External `pptx` skill, fed from this skill's outline, copy, and notes |
| A deck sent to be read (investor pitch) | Marp to PDF, or `pptx` when the recipient expects PowerPoint |

## Marp (default)

Front matter turns the file into a deck; `---` on its own line separates slides; a slide's presenter note is an HTML comment at the end of that slide.

```markdown
---
marp: true
theme: default
size: 16:9
paginate: true
style: |
  section { background: #000; color: #fff; font-family: Inter, system-ui, sans-serif; }
  section.accent-teal h1 { color: #14b8a6; }
---

<!-- _class: lead accent-teal -->

# <!-- fit --> AI has no memory

Every session starts from zero

<!-- Open with the outage story. Pause after the headline. -->

---

<!-- _class: accent-red -->

## The bottleneck moved

- **Code got cheap.** Agents write it faster than we review it.
- **Judgement did not.** Nobody tooled for it.

<!-- Transition: "so where does the leverage go?" -->
```

Directive mechanics that matter:

- Global directives (`theme`, `size`, `style`, `math`) go in the front matter once. `size` accepts `16:9` (1280x720) and `4:3` (960x720).
- Local directives apply from the current slide onward (`<!-- paginate: true -->`); an underscore prefix makes a spot directive for the current slide only (`<!-- _class: lead -->`, `<!-- _backgroundColor: #e54f11 -->`). Section colours are spot `_class` directives, one per slide, styled in the front-matter `style` block.
- `# <!-- fit --> Headline` scales a heading to the slide width: the big-statement slide.
- A comment is a directive when its body parses as `key: value` lines, otherwise a presenter note. Start notes with a sentence, not a colon-separated pair.

Export with marp-cli. PDF, PPTX, and images need Chrome, Edge, or Firefox installed:

```bash
npx @marp-team/marp-cli deck.md -o deck.html
npx @marp-team/marp-cli deck.md --pdf --pdf-notes -o deck.pdf
npx @marp-team/marp-cli deck.md --notes -o notes.txt
```

## Slidev

Same skeleton: headmatter, `---` separators, per-slide front matter for layout, HTML comment at the end of the slide for the note.

```markdown
---
theme: default
---

# AI has no memory

Every session starts from zero

<!-- Open with the outage story. -->

---
layout: two-cols
---

# The bottleneck moved

::right::

- **Code got cheap.**
- **Judgement did not.**
```

`v-click` on a list item reveals it on the next keypress; use it for a build, not for decoration. Export needs `playwright-chromium`: `slidev export` (PDF), `slidev export --format pptx`, `--format png`. Interactive components do not survive export; a deck built for them is a web deck, hosted, not exported.

## reveal.js

Markdown lives inside `<section data-markdown><textarea data-template>`; the horizontal separator defaults to a `---` line; speaker notes start on a `Note:` line at the end of the slide, read by the speaker view (`s` key). The HTML shell is the deck, so a reveal.js deck is a small web project, not a single file.

## Handing off to the pptx skill

The `pptx` skill builds and edits the file; this skill decides what goes on each slide. Hand it, in one message:

1. The outline from `outline-structure.md` with the section colour on every divider
2. The per-slide copy (headline, body) from Step 4
3. The speaker note for each slide, to go into the notes pane, never into a text box on the slide
4. The colour system and type hierarchy from Step 5, translated to pt (`visual-design.md` has the fixed-canvas scale)

Where its defaults differ from this skill's (bold titles, a visual on every slide), this skill's direction wins on colour and type hierarchy, and its mechanics win on safe fonts, margins, notes, and QA rendering. Hand over the whole deck at once: a slide-by-slide handoff loses the section colour rhythm.

## Gotchas

- `--pptx` from Marp and `--format pptx` from Slidev rasterise every slide to an image inside the `.pptx`. Text is not selectable, searchable, or editable. `--pptx-editable` in marp-cli is experimental and loses styling. When the recipient needs to edit, use the `pptx` skill.
- A Marp presenter note whose first line looks like `Key point: speed` is parsed as a directive and vanishes from the notes export. Write `The key point is speed.` or move the colon.
- `marp: true` is what Marp for VS Code keys on; without it the file previews as plain markdown and the `---` lines render as horizontal rules.
- A Marp `style` block that sets `section` colours also needs `h1`, `h2`, `a`, and `code` colours: theme defaults are built for a light background and leave dark-blue links on a black slide.
- reveal.js `---` separators need blank lines on both sides in external markdown, or the file renders as one slide.
