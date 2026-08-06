# Story Structure

An outline sequences slides. A story makes the audience want the next one. Do this before the outline: the spine decides which slides exist.

Adapted from Pixar's 22 rules of storytelling, written by Emma Coats. They were written for films, and they transfer to talks because a talk has the same problem: a room that can leave at any moment.

## Contents

- [The spine](#the-spine)
- [Find the story before the slides](#find-the-story-before-the-slides)
- [Make the audience want the next slide](#make-the-audience-want-the-next-slide)
- [When you are stuck](#when-you-are-stuck)
- [Knowing when to stop](#knowing-when-to-stop)
- [Output](#output)

## The spine

Fill this in, in one sitting, before any slide exists:

```text
Once upon a time ___.
Every day ___.
One day ___.
Because of that ___.
Because of that ___.
Until finally ___.
```

Mapped onto a deck:

| Beat | The deck's job | Slides |
|------|----------------|--------|
| Once upon a time | The world the audience already lives in | Opening, framing |
| Every day | The status quo, stated plainly enough that they nod | Context |
| One day | What changed, or the question that breaks the status quo | The tension slide |
| Because of that | The consequence, and the consequence of that | Core sections |
| Until finally | Where it lands, and what they do about it | Close, next steps |

A worked spine, from a talk on tooling for coding agents:

> Once upon a time writing code was the expensive part. Every day we optimised for typing less of it. One day agents made code cheap. Because of that the bottleneck moved to judgement, which nobody had tooled for. Because of that the only leverage left was encoding your taste where the agent reads it. Until finally the tools you build for yourself are the thing worth giving away.

If a slide does not serve a beat, it is a fact you found interesting. Cut it.

## Find the story before the slides

**Write the ending first.** Endings are hard. Get yours working before the middle, or you will build five sections toward a close that does not exist yet and rewrite all of them.

**Ask why this story.** What is the belief burning underneath? That is the heart of it, and it is also the answer to why you are the one on stage. A deck with no answer here becomes a summary, and a summary can be an email.

**Discount the first idea. And the second, third, fourth, fifth.** The first structure that comes to mind is the one everyone in the room has already seen. Get the obvious out of the way on paper, then look at what is left.

**Take apart a talk you loved.** What you like in it is a part of you, and you cannot use it until you can name it. Name the move, then find where it fits your spine.

**Put it on paper.** A perfect deck in your head is unfixable. A rough one on paper can be fixed today.

## Make the audience want the next slide

**Give the deck an opinion.** A passive deck that surveys the landscape feels safe to write and is poison to an audience. Take a position that a reasonable person could disagree with. If nobody could disagree, you have not said anything.

**Name the stakes.** What happens if they do nothing? What does the room lose? Stack the odds against your own argument and then answer it; a claim that never met resistance reads as unearned.

**Admire the trying, not the winning.** An audience roots for the attempt. A deck that only shows the finished result skips the part they connect to. The failed version, the thing that took three tries, the constraint you worked around: those are the slides people remember.

**Throw the opposite at your subject.** If your thesis is comfortable in one setting, show it where it should break. How it holds up there is the proof; how it fails is the honest caveat that buys trust for everything else.

**Coincidence rule.** A surprising fact may open a problem. It may never resolve one. If a section ends with "and then it turned out fine", the audience is being asked to accept a conclusion the slides did not earn.

**Honesty for the unbelievable parts.** If you were sitting where the audience is, what would you not believe? Say that out loud, then answer it.

## When you are stuck

**List what WOULDN'T happen next.** The most useful of the 22 rules. Write five things that could not follow from the slide you are stuck on. The blocked feeling comes from circling one obvious continuation; naming its opposites usually surfaces the material.

**Simplify, focus, combine, hop over detours.** Merge two sections that make one point. Cut the setup for a payoff you removed. It will feel like losing something valuable and it will set the deck free.

**Move on if it is not working.** No work is wasted. A section that will not come together goes in a notes file and often comes back useful in the next talk.

## Knowing when to stop

Story is testing, not refining. You learn what the deck is about by running it end to end, not by polishing slide four for the ninth time. Get a rough version complete, run it out loud against a clock, then rewrite from what you learned. Trying for a theme is worth doing, and you will not see what the deck is actually about until you reach the end of it. Then rewrite.

Finish and let go, even imperfect. In an ideal world you have both finished and perfect. Move on. Do better next time.

## Output

Add this above the outline, before any slide is written:

```markdown
## Spine

- **Once upon a time:** [the world they live in]
- **Every day:** [the status quo]
- **One day:** [what changed]
- **Because of that:** [first consequence]
- **Because of that:** [second consequence]
- **Until finally:** [where it lands]

**Why this story:** [the belief underneath]
**The position:** [what a reasonable person could disagree with]
**The stakes:** [what the audience loses by doing nothing]
**The ending, written first:** [the final slide, verbatim]
```
