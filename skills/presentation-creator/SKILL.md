---
name: presentation-creator
description: Builds decks with a story spine, house visual system, setting-specific density, and speaker notes. Use when asked to "create a presentation", "write a pitch deck", or "turn this doc into slides". Defaults to Marp; use an available presentation tool for editable PowerPoint. For product UI use ui-design.
---

# Presentation Creator

Bold, minimal slide decks with a story underneath: spine to final QA.

- **IS:** slide decks end to end: story spine, slide sequence, slide copy, visual system, speaker notes, investor pitch decks, and decks built as a web app; output as Marp markdown (default), Slidev or reveal.js markdown, or a Next.js deck app.
- **IS NOT:** producing or editing the `.pptx`/`.potx` file itself (available presentation/PPTX skill or tool; hand it the finished outline, copy, and notes from this skill), charts inside a slide (external `dataviz` where installed), long-form prose (external `ghostwriter` with platform `blog`), marketing copy outside slides (`copywriting`), or product UI (`ui-design`).

## Workflow

Track this checklist:

```text
Presentation progress:
- [ ] Step 1: Gather context (audience, setting, venue, three messages, output format)
- [ ] Step 2: Write the story spine and the ending (references/story-structure.md)
- [ ] Step 3: Outline the slide sequence (references/outline-structure.md)
- [ ] Step 4: Write slide copy (references/writing-slides.md; pitch decks: references/pitch-decks.md instead)
- [ ] Step 5: Design colour, type, and layout (references/visual-design.md)
- [ ] Step 6: Write speaker notes (references/speaker-notes.md); skip for a deck sent without a presenter
- [ ] Step 7: Emit the deck in the chosen format (references/output-formats.md or references/web-deck.md)
- [ ] Step 8: QA pass, output the slide-by-slide review table
```

### Step 1: Gather context

Establish these, asking only for what the brief does not answer:

- **Audience:** internal (shared context, be direct) vs. external (build credibility, define terms).
- **Setting:** live talk, recorded/async, or a pitch deck sent to investors and read without you.
- **Venue:** a dark room or a large hall takes the dark system; a bright meeting room, daylight, or a deck that doubles as a handout takes a light palette. Ask when unknown, because it decides Step 5.
- **The three messages:** what the audience must remember after the deck.
- **Output format:** Marp markdown unless there is a reason otherwise. A web app when the deck should run a live demo or live at a URL. A `.pptx` when the user names the file or a house template, produced by the external `pptx` skill from this skill's outline, copy, and notes. Decide now, not at Step 7: the format sets the type and notes mechanics in Steps 5 and 6.

Route by setting:

- **Live talk, internal, or recorded deck** → Steps 2-8 in order.
- **Investor pitch deck sent to be read** → [references/pitch-decks.md](references/pitch-decks.md) first. Its 10-slide framework replaces Step 3's outline, and its async copy rules replace `writing-slides.md` at Step 4 (do not load both: their density rules contradict). Step 2 still applies in compressed form; the spine is what stops a pitch reading as a feature list. Skip Step 6. The same company pitching live on a demo-day stage is a presented deck: use the standard path with the pitch framework as its outline.

### Steps 2-7: Build the deck

Read each step's reference when you reach it:

| Step | Reference | Covers |
|------|-----------|--------|
| 2. Story | [references/story-structure.md](references/story-structure.md) | The spine template, writing the ending first, taking a position, stakes, the unstick move |
| 3. Outline | [references/outline-structure.md](references/outline-structure.md) | Narrative flow, 12 slide types, section colours, outline output format |
| 4. Write | [references/writing-slides.md](references/writing-slides.md), replaced by [references/pitch-decks.md](references/pitch-decks.md) on the pitch path | Headline patterns, body rules, copy per slide type, before/after examples |
| 5. Design | [references/visual-design.md](references/visual-design.md) | Two colour systems, contrast thresholds, fluid and fixed type scales, layout patterns, slide type to layout mapping |
| 6. Notes | [references/speaker-notes.md](references/speaker-notes.md) | Per-slide note structure, delivery cues, notes by slide type |
| 7. Emit | [references/output-formats.md](references/output-formats.md) | Marp syntax and export, Slidev and reveal.js equivalents, the `pptx` handoff, where notes live in each |
| 7. Emit (web) | [references/web-deck.md](references/web-deck.md) | Route-per-slide structure, navigation, layout primitives, motion, live demos |
| Changing this skill | `evals/evals.json` | Behavioural scenarios with assertions, plus should-trigger and near-miss routing prompts. Never loads during a user task |

Read `web-deck.md` only after the copy exists. Primitives designed before the outline get shaped around slide 3 and fight every slide after it.

### Step 8: QA pass (produces evidence)

Render the delivered format and inspect every slide. Record layout defects and measured contrast; a self-assigned glance score is editorial judgement. Keep the detailed table with the artifact when useful, and summarize material results in chat:

```markdown
| # | Slide | 3-sec test | One message | Spine beat | Layout | Colour | Contrast |
|---|-------|-----------|-------------|------------|--------|--------|----------|
| 1 | Title | pass | pass | once upon a time | full statement | teal | 12.6:1 |
```

- **3-sec test:** parseable in three seconds at arm's length (Duarte's glance test). Cut copy on any failure until it passes. Pitch decks are read, not glanced: substitute "makes sense forwarded with no context".
- **One message:** exactly one idea per slide; split slides carrying two.
- **Spine beat:** which beat of the Step 2 spine this slide serves. A slide serving none is a fact you found interesting; cut it.
- **Layout:** the layout should change when the slide's job changes. Flag a run of three or more identical layouts and keep it only when the section is deliberately a list.
- **Colour:** the section accent, or the full-bleed palette, matching what Step 5 assigned.
- **Contrast:** the smallest text on the slide against its background. 4.5:1 for body and captions, 3:1 only for text at 24px (18pt) or larger. Record the ratio, not "ok".

Deck-level checks below the table:

- Every spine beat has at least one slide, and the ending matches the one written first
- The deck states a position a reasonable person could disagree with
- One colour system throughout: accents per section, or full-bleed palettes, never both
- Recap slide has exactly one line per core section
- Speaker notes sit where the output format reads them (Marp and Slidev: an HTML comment at the end of the slide; reveal.js: a `Note:` line; `.pptx`: the notes pane)
- Pitch decks only: 10 slides plus an appendix at most, explicit ask slide (amount and use of funds), headlines pass the forwardable test

Fix observed defects and inspect affected slides again. If rendering is unavailable, label visual verification unrun.

## Core principles

- **Story before slides:** the spine decides which slides exist. Write the ending first.
- **Take a position:** a deck nobody could disagree with has not said anything.
- **Headlines do the work:** the complete claim, not a topic label. "Q3: revenue up 40%. Here's how." beats "Q3 performance overview".
- **Impact through scale, not weight:** large light type beats small bold type.
- **One colour system, held for the whole deck:** full-bleed palettes where a palette owns the entire slide, or dark with one accent per section. Either is the rhythm the audience tracks position by.
- **Demo it live where you can:** a working demo on a web deck, not a screenshot of one; a recording where the demo cannot run offline.

## Gotchas

- **Dark deck in a bright room:** the default dark system relies on the room. Under daylight or a weak projector the black background goes grey and white body text washes out. Ask about the venue in Step 1; take the light "paper" palette or a white background when the answer is bright, and test on the projector, not the laptop.
- **Contrast checked at headline size only:** a saturated full-bleed pair that reads at 100px fails at 20px caption size. Check the smallest text on the slide: 4.5:1 for body and captions, 3:1 for 24px-plus text, from the actual hex values. Record the ratio in the QA table.
- **Export "PPTX" from Marp or Slidev and call it done:** both rasterise each slide into an image inside the `.pptx`. Text is not selectable or editable, so the deck the client wanted to edit is a stack of pictures. When editable PowerPoint is the deliverable, route to the `pptx` skill.
- **Notes and directives both live in HTML comments in Marp:** `<!-- _class: lead -->` is a directive, `<!-- Open with the outage story -->` is a presenter note. A note that starts with a `key: value` line silently becomes a directive.
- **Fixed pixel type on a web deck:** a deck sized for the presenter's laptop is a different deck on the projector and unreadable on the phone it gets forwarded to. Size in `clamp()`; Marp and `.pptx` decks are fixed canvases and take pt sizes instead.
- **Presented-deck density on a pitch deck sent by email:** a 3-words-per-slide deck forwarded with no presenter is unreadable. Route to `pitch-decks.md` at Step 1, not after the deck is built. The inverse also fails: a 60-word slide on a demo-day stage.
- **Sparse headlines on pitch decks:** "Traction" tells a skimming investor nothing. Write the claim: "1,000+ customers, $10M ARR".
- **Skipping the spine:** jumping straight to slides produces a list of facts with no arc, then a rewrite once the missing narrative shows. Spine and ending first.
- **Speaker notes as a script:** a verbatim script gets read aloud and sounds flat. Notes are prompts: key point, talk-track bullets, transition line.
- **Accents outside the section system:** section colours are wayfinding; a random mid-section accent reads as a topic change that never happened. On a full-bleed deck the slide is the accent; the colour changes at the slide boundary, not inside it.
- **Paragraphs on slides:** the audience reads instead of listening and the speaker becomes redundant. Cut until the 3-second test passes.

## Related skills

- External `pptx` skill (anthropics/skills) where installed: creating, editing, and QA of the `.pptx` file. This skill owns story, outline, copy, and notes; on a visual conflict inside a `.pptx`, this skill's colour system and type hierarchy set direction and the `pptx` skill's font, margin, and notes mechanics win.
- External `dataviz` skill where installed: any chart or metric tile on a slide.
- `copywriting`: landing pages, CTAs, marketing copy outside a deck.
- `ui-design`: visual systems for product UI and landing pages; presentation visual rules live in `references/visual-design.md` instead.
- External `ghostwriter` where installed: long-form articles from the `blog` platform profile, when the output is prose, not slides.
