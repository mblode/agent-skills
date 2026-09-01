# AI writing patterns: detection and fixes

## Table of contents

1. [Formatting](#1-formatting)
2. [Sentence structure](#2-sentence-structure)
3. [Template phrases](#3-template-phrases)
4. [Transition phrases](#4-transition-phrases)
5. [Structural issues](#5-structural-issues)
6. [Chatbot artefacts](#6-chatbot-artefacts)
7. [Drafting tells](#7-drafting-tells)
8. [Severity tiers](#8-severity-tiers)
9. [Sources and drift](#9-sources-and-drift)

---

## 1. Formatting

### Em dashes

Zero, in headings and body copy alike. Replace with a comma, colon, full stop, parentheses, or two sentences; a colon is the usual fix when the dash introduced an elaboration. Catch `U+2014`, the double-hyphen substitute (`--`), and a spaced hyphen standing in for one (` - `). A spaced em dash (U+2014 with a space on each side) is the strongest single formatting tell: no major style guide spaces it, and models do. Copy is short enough that any allowance is meaningless, so treat a single occurrence as a failure rather than a frequency to manage.

### Title Case headings

Every main word capitalised in a heading or button ("Impact Of Technology And Digitalisation", "Get Started Today") where the surrounding product uses sentence case. Apple, Material, Polaris, Atlassian, and GOV.UK all specify sentence case for UI text, so Title Case reads as pasted in. Match the surface; where the casing convention itself is in question, `typography-audit` owns it.

### Mixed quotation marks

Curly quotes (“ ” ‘ ’) in one line and straight quotes (" ') in the next. Models mix them within one response; humans set one and keep it. Pick the convention the codebase or CMS uses and apply it throughout.

### Bold labels

A bold label takes a colon, not a period: `**Pricing:**`, never `**Pricing.**`. The period version is a formatting tell that survives most edits because it looks deliberate.

### Bold overuse

Strip bold from most phrases. Max one bolded phrase per major section, ideally none. If something is important enough to bold, restructure the sentence to lead with it instead.

### Emoji in headers

Remove entirely. No `## 🚀 What This Means`. Social posts may use one or two sparingly, at line end, never mid-sentence.

### Excessive bullet lists

Convert bullet-heavy sections into prose paragraphs. Bullets only for genuinely list-like content: feature comparisons, step-by-step instructions, API parameters. If a bullet list has a repeating bold header per item, strip the headers and write as prose.

---

## 2. Sentence structure

### Hollow intensifiers

Cut: genuinely, truly, quite frankly, to be honest, let's be clear, it's worth noting that, real (as in "a real improvement"). Just state the fact.

### Vague endorsement ("worth [verb]-ing")

Cut: worth reading, worth paying attention to, worth a look, worth exploring, worth checking out. These swap a generic thumbs-up for a specific reason. Say why something matters instead.

### Hedging

Cut: perhaps, could potentially, it's important to note that, to be clear. Make the point directly. Don't stack them either ("could potentially eventually").

### Announced honesty

Cut: "honestly", "to be honest", "one honest note", "I'll be straight with you". Labelling one line as the honest one implies the rest isn't. Delete the label and keep the line.

### Emotional flatline

Cut: "what struck me was", "I couldn't help but notice", "it's fascinating that". These narrate a reaction instead of giving the reader the thing that caused it. State the thing.

### Negative parallelisms

"It's not X, it's Y", "not just X but Y", "not only X but also Y", and the quieter "X rather than Y". Each sets up a misconception nobody held so the sentence can knock it down. Max one per piece, and only where the reader actually arrived believing X. Otherwise state Y.

### Participle tails

An "-ing" phrase bolted onto a finished sentence to add an unearned conclusion: "...connects to Slack and Linear, ensuring your team stays aligned", "...ships in one click, highlighting our commitment to speed", "...reflecting a broader shift toward". The first clause did the work; the tail narrates significance. Cut at the comma. This is the most common current-era tell and the one word lists miss entirely, because the words in the tail ("ensuring", "highlighting", "reflecting") are ordinary on their own.

### Compulsive rule of three

Vary groupings: two items, four, or a full sentence instead of triads. Max one "adjective, adjective, and adjective" per piece.

### Missing connective tissue

Each paragraph connects to the last. If they could be rearranged unnoticed, add a bridge sentence.

---

## 3. Template phrases

Slot-fill constructions that signal a sentence was generated, not written:

- "a [adjective] step towards [adjective] AI infrastructure" → describe the specific capability or outcome
- "a [adjective] step forward for [noun]" → say what actually changed
- "Whether you're [X] or [Y]" → false breadth. Pick the audience you're writing for, or cut
- "I recently had the pleasure of [verb]-ing" → say what happened: "I talked to," "I read," "I attended"
- "In today's [X]" / "In an era where" → cut or state specific context
- "When it comes to" → talk about the thing directly

---

## 4. Transition phrases

Remove or rewrite these:

- "Moreover" / "Furthermore" / "Additionally" → make the connection obvious, or use "and," "also," "on top of that"
- "It's worth noting that" / "Notably" → just state the fact
- "Here's what's interesting" / "Here's what caught my eye" → let content signal its own importance. If you need a lead-in, make it specific: "The revenue number matters because..."
- "In conclusion" / "In summary" / "To summarise" → the conclusion should be obvious without the label
- "At the end of the day" → cut
- "That said" / "That being said" → cut, or use "but," "yet," "however" (don't overuse any one)

---

## 5. Structural issues

### Uniform paragraph length

If every paragraph is roughly the same size, vary deliberately: some one sentence, some longer.

### Formulaic openings

If it opens with broad context before the point ("In the rapidly evolving world of..."), lead with the news or insight instead. Context comes second.

### Section summaries

A closing line that restates the section: "In summary", "Overall", "Ultimately, ...", or a final sentence that repeats the headline in different words. Marketing copy has no room for a recap; end on the proof or the CTA.

### Rhetorical-question openers

"So why should you care?", "What does this mean for your team?", "Sound familiar?" Questions the reader didn't ask, answered by the writer. Delete the question and open with the answer.

### Engagement hooks

"Here's the thing.", "The kicker?", "Plot twist:", "But here's where it gets interesting." A tee-up that promises significance the next sentence has to deliver anyway. Cut the tee-up and state the thing; if the thing is interesting, it survives without the label.

### Copula avoidance

AI avoids "is" and "has" with fancier verbs: "serves as," "features," "boasts," "presents," "represents." Reads like a press release. Default to "is" or "has" unless a specific verb adds real meaning.

### Synonym cycling

AI rotates synonyms to avoid repeating a word: "developers… engineers… practitioners… builders" in one paragraph. Humans repeat the clearest word. If the noun appears three times and it's right, keep all three.

### Vague attributions

"Experts believe," "Studies show," "Research suggests" without naming the expert, study, or source. Cite a specific source, or drop the attribution and state the claim directly.

### Significance inflation

"Marking a pivotal moment in the evolution of..." or "a watershed moment for the industry" inflate routine events. State what happened. Let the reader judge significance.

### False ranges

AI fakes breadth by pairing unrelated extremes: "from the Big Bang to dark matter," "from ancient civilisations to modern startups." Sound sweeping but say nothing. List the actual topics, or pick the one that matters.

---

## 6. Chatbot artefacts

Remove entirely from published prose:

- "I hope this helps!", "Certainly!", "Absolutely!", "Great question!", "Feel free to reach out", "Let me know if you need anything else"
- "In this article, we will explore…" or "Let's dive in!" → cut, or open directly
- "Let's explore," "Let's take a look," "Let's break this down" → any "let's + verb" used as a transition, not a genuine invitation. Start with the point
- "Let me think step by step," "Breaking this down," "To approach this systematically," "Step 1:" → chain-of-thought leaking into prose. State the conclusion, then the evidence
- Acknowledgement loops: "You're asking about," "To answer your question," "That's a great question. The..." → just answer
- Sycophantic openers: "Great question!", "Excellent point!", "You're absolutely right!" → remove entirely

---

## 7. Drafting tells

These don't show up as a bad phrase on the page. They show up as copy that is competent and still reads as generated, so they survive every word-level pass.

### Prompt echo

The draft reuses the brief's own phrasing. Asked for copy about "a unified workspace for distributed teams", it returns a headline about a unified workspace for distributed teams. Take the facts from the brief, throw away its wording, and say it the way the brand says things. This is the single biggest tell in copy that otherwise passes every other check here.

### Generic default over the supplied specific

The brief gives a real number, name, integration, or price, and the draft ships the category-standard placeholder instead ("thousands of teams" over the supplied 4,200; "your favourite tools" over the supplied Slack and Linear). Every specific the user supplied appears in the copy, or it was cut for a stated reason.

### Uniform confidence

Every line lands at the same pitch, usually mid-enthusiasm. Real copy has a flat line next to a strong one. If no sentence is plainer than the ones around it, the emphasis is doing nothing.

---

## 8. Severity tiers

Prioritise fixes when time is limited.

### P0: credibility killers (fix immediately)

- Cutoff disclaimers: "As of my last update," "I don't have access to real-time data"
- Chatbot artefacts: "I hope this helps!", "Great question!"
- Vague attributions without named sources: "Experts believe"
- Significance inflation on routine events: "a watershed moment for the industry"
- A specific the user supplied (number, name, price, integration) replaced by a generic default

### P1: obvious AI smell (fix before publishing)

- Prompt echo: the copy hands the brief's own wording back
- Tier 1 word violations (delve, leverage, robust, seamless, etc.)
- Template phrases and slot-fill constructions
- "Let's" transition openers
- Formulaic openings ("In the rapidly evolving world of...")
- Engagement hooks and rhetorical-question openers
- Participle tails ("...ensuring", "...highlighting", "...reflecting")
- Negative parallelisms beyond one per piece
- Bold overuse
- Any em dash, `--`, or spaced hyphen standing in for one

### P2: stylistic polish (fix when time allows)

- Generic conclusions ("The future looks bright", "Only time will tell")
- Compulsive rule of three
- Uniform paragraph length and uniform confidence
- Announced honesty and emotional flatline
- Bold labels closed with a period instead of a colon
- Title Case headings and mixed quotation marks on a sentence-case surface
- Section summaries
- Copula avoidance (serves as, features, boasts)
- Overused transition phrases (Moreover, Furthermore, Additionally)
- Tier 2 word clusters in the same paragraph

**Quick triage rule:** For a fast pass, fix P0 and P1 only. A clean P0+P1 pass is publishable. P2 is polish.

---

## 9. Sources and drift

The structural catalogue above tracks Wikipedia's *Signs of AI writing* (https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing), which is maintained against live examples and revised as models change. Two things it records that matter here:

- **Vocabulary drifts by model generation.** "delve", "tapestry", and "testament" peaked in 2023 to mid-2024 and fell away; "align with", "fostering", "enhance", "highlighting", and "showcasing" carried mid-2024 to mid-2025; from mid-2025 the reliable words narrowed to "emphasizing", "enhance", "highlighting", and "showcasing". Structural tells (participle tails, negative parallelisms, copula avoidance, significance inflation) have stayed stable across generations, which is why this file weights them above the word tables.
- **Some old tells no longer work.** Knowledge-cutoff disclaimers and outright prompt refusals rarely survive to publication now, and lexical-diversity heuristics do not separate edited AI text from human text. Treat them as P0 when they do appear, but a clean pass on them proves nothing.

When a word in `word-lists.md` stops appearing in generated copy, drop it from Tier 1 rather than keeping a fossil list that flags human writing.
