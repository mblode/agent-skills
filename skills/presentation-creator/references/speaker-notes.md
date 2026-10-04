# Speaker Notes

Scannable prompts for natural delivery, not scripts to read verbatim.

## Per-slide note structure

```markdown
### Slide [N]: [Headline]

**Key point:** [The ONE thing they must remember]

**Open with:** [First sentence or hook, conversational tone]

**Talk track:**
- [Prompt 1]
- [Prompt 2]
- [Optional anecdote or example]

**Transition:** [Bridge to next slide]
```

## Notes by slide type

**statement / question**: Expand on the headline: what led to this conclusion, what's the implication. For questions, pause and let it land before answering.

**data**: Contextualize the numbers: what story do they tell? What surprised you?

**section-divider**: Brief: quick framing of what's coming, how it connects to what came before.

**recap**: Don't re-present. Touch each point quickly, add one synthesis insight, set up "so what."

## Delivery cues

Include when relevant:
- **(pause)**: let a point land
- **(show of hands)**: audience interaction
- **(click)**: advance animation or build
- **(emphasize)**: vocal stress on key word
- **(scan room)**: make eye contact before transitioning

## Where the notes go

The output format reads notes from one place each: Marp and Slidev take an HTML comment at the end of the slide, reveal.js a `Note:` line, a `.pptx` the notes pane (never a text box on the slide). `output-formats.md` has the syntax. Keep the structure above inside that slot; the headings become plain lines in a Marp comment, and a first line shaped like `Key point: X` parses as a Marp directive, so write it as a sentence.

## Context adjustments

Internal notes can lean on shared history and be candid about what is hard; external notes prove before concluding; recorded or async notes are tighter, with stronger signposting.
