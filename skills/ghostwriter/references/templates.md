# Templates

Starting shapes for pieces with a fixed skeleton, used where the profile is silent; a profile's message shapes win. Every heading earns its place: delete a section the piece does not need rather than fill it, and never leave a heading with a placeholder sentence under it. Slots take the user's facts; a slot with no fact becomes `[placeholder]` or goes.

## PRD

Title is the outcome, not the feature name.

- **Problem:** who has it, how often, and the evidence (a number, a quote, a ticket).
- **What changes for them:** the behaviour after, in one paragraph, from the user's side.
- **How we will know:** one measurable with its baseline and the date we check it.
- **Out of scope:** the things a reader will assume are in.
- **Open questions:** left open, each with an owner.

Drop Background when Problem carries it, and Alternatives unless one was seriously weighed.

## Design doc, RFC, ADR

- **Context:** the constraint that makes this worth writing, in three sentences.
- **Decision:** what we will do, stated as a decision when made and as a proposal when not.
- **Why this over the alternatives:** the one or two considered, each with the reason it lost in a sentence.
- **Consequences:** what gets harder, what we now commit to, and the migration if there is one.
- **Input wanted:** the specific decision still open, never "thoughts welcome".

An ADR is Context, Decision, Consequences, dated, one page. A design doc written after the thing shipped is a changelog; say what was decided and skip the proposal voice.

## Linear issue

Title is the gap as a verb phrase: "Export ignores archived rows". Body: the gap, then "so" plus the cost; how to see it (steps or a link); done when (one or two checkable statements); out of scope. A comment adds one fact or one decision and stops.

## Docs pages

- **Tutorial:** what you will build and have at the end; prerequisites, only what a reader may lack; numbered steps, each with a visible result; what you built and the one next step.
- **How-to:** the goal as the title ("Rotate an API key"); before you start; steps; verify; related tasks.
- **Reference:** one entry shape repeated without variation: name or signature, one-sentence description, parameters table (name, type, default, description), returns, errors, example.
- **Explanation:** the question as the title ("Why sessions expire"); the answer first; the reasoning; when it does not apply.

## Blog post

Title is the claim or the specific thing that happened, never a count. The episode or the number lands in the first two sentences. Two to four sections under plain noun headings, or none. Close on the last concrete fact: no summary, no call to action unless the profile has one.

## Talk script

Cold open on the first thing that happened; no "today I'll talk about". One line per slide change: `[slide: title]`. The story in order, each section ending on the line that earns the next slide. Close on the one thing to remember, then stop; questions are not a section.
