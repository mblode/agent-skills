# Voice chart

Read when a product has no voice file and needs one, or when an existing one is a list of adjectives nobody can apply. A voice chart is the artefact that makes brand voice usable: it turns "friendly and confident" into copy a writer can check a line against.

Output it as `VOICE.md` at the repo root, where the copy work will find it next time.

## Structure

Three to five concepts. Fewer than three is not a voice, more than five is not memorable. Each concept has three parts, and the third is the one that does the work:

1. **Concept.** A brand principle, one word or a short phrase.
2. **Characteristics.** Two or three adjectives naming how the concept shows up in writing.
3. **Do and don't.** Real interface or page strings, in pairs. Abstract description is not a substitute; a writer settles an argument by pointing at a pair.

The don't side is the useful half. A don't that no reasonable writer would produce ("Don't be rude to users") teaches nothing. Make it the plausible near-miss that the team actually ships.

## Template

```markdown
## Concept: [principle]

**Characteristics:** [adjective], [adjective], [adjective]

**What this means:** [one or two sentences on how it changes the writing]

**Do**
- "[real string]"
- "[real string]"

**Don't**
- "[the plausible near-miss]"
- "[the plausible near-miss]"
```

## Worked example

## Concept: Direct

**Characteristics:** plain, front-loaded, unhedged

**What this means:** the reader gets the outcome in the first few words. No preamble, no softening a fact into a suggestion.

**Do**
- "Your export is ready. It expires in 7 days."
- "This deletes the project and its 40 files."

**Don't**
- "We wanted to let you know that your export is now available."
- "Please note that this action may affect associated files."

## Concept: Specific

**Characteristics:** concrete, numbered, named

**What this means:** every claim carries a number, a name, or an example. A sentence that would survive on a competitor's site has not said anything.

**Do**
- "Cuts weekly reporting from 4 hours to 15 minutes."
- "Connects to Slack, Linear, and GitHub."

**Don't**
- "Saves your team valuable time."
- "Integrates with the tools you already use."

## Filling one in

- Start from shipped copy, not from brand values. Pull twenty real strings, sort them into the ones that feel right and the ones that don't, and name the pattern. Values documents describe the company; the strings describe the voice.
- Write the don't column from the copy that got rewritten in review. That history is where the voice actually lives.
- Record locale and spelling convention (en-AU, en-US), the terms with a house spelling, and any word the brand uses deliberately that a generic word list would flag. That last line prevents an audit stripping a signature word.
- Name what the voice is not. "Confident, not boastful" settles more edits than three more adjectives.
- Revisit it when a rewrite feels wrong but no rule explains why. That gap is a missing concept.

## Tone by reader state

Voice is the brand's personality and does not change between screens. Tone is how that voice meets the reader's state, and it is expected to shift. A tone shift is not voice drift; drift is when the copy reads as a different brand, not the same brand in a different moment.

| Reader state | Tone | Example |
|--------------|------|---------|
| Frustrated (error, failure, block) | Empathetic, solution-first, never blaming | "Payment failed. Your card was declined. Try a different card." |
| Confused (first use, complex feature) | Patient, one step at a time | "Connect your bank to see spending insights. We'll walk you through it." |
| Confident (routine task, return visit) | Efficient, minimal | "Saved" |
| Cautious (high stakes, data loss) | Serious, transparent, no nudging | "Delete account? You'll lose all data and this can't be undone." |
| Successful (completion) | Positive, proportional, brief | "Your changes are live." |

Record the shifts the brand permits in `VOICE.md` next to the concepts, so a reviewer flagging a brisk "Saved" next to a careful deletion warning can see both were intended.

## Common characteristics

Pick from these when naming a concept, then make them concrete with pairs:

**Warm:** friendly, encouraging, welcoming, supportive, human
**Neutral:** clear, direct, practical, matter-of-fact, informative
**Serious:** precise, measured, transparent, respectful, careful
**Personality:** playful, witty, dry, conversational, technical, humble, confident

Adjectives alone are not a voice chart. Two brands claiming "friendly and clear" write nothing alike; the pairs are what distinguish them.
