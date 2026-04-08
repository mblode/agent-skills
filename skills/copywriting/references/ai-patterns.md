# AI writing patterns — detection and fixes

## Table of contents

1. [Formatting](#1-formatting)
2. [Sentence structure](#2-sentence-structure)
3. [Template phrases](#3-template-phrases)
4. [Transition phrases](#4-transition-phrases)
5. [Structural issues](#5-structural-issues)
6. [Chatbot artefacts](#6-chatbot-artefacts)
7. [Severity tiers](#7-severity-tiers)

---

## 1. Formatting

### Em dashes

Hard max: 1 per 1,000 words. Zero is better. Replace with a comma, full stop, parentheses, or rewrite as two sentences. Applies to headings and body copy alike. Catch both the Unicode em dash (—) and the double-hyphen substitute (--).

### Bold overuse

Strip bold from most phrases. Maximum one bolded phrase per major section — ideally none. If something is important enough to bold, restructure the sentence to lead with it instead.

### Emoji in headers

Remove entirely. No `## 🚀 What This Means`. Social posts may use one or two emoji sparingly, at the end of a line, never mid-sentence.

### Excessive bullet lists

Convert bullet-heavy sections into prose paragraphs. Bullets only for genuinely list-like content: feature comparisons, step-by-step instructions, API parameters. If a bullet list has a bold header per item that repeats itself, strip the headers and write as prose.

---

## 2. Sentence structure

### Hollow intensifiers

Cut: genuinely, truly, quite frankly, to be honest, let's be clear, it's worth noting that, real (as in "a real improvement"). Just state the fact.

### Vague endorsement ("worth [verb]-ing")

Cut: worth reading, worth paying attention to, worth a look, worth exploring, worth checking out. These substitute a generic thumbs-up for a specific reason. Say why something matters instead.

### Hedging

Cut: perhaps, could potentially, it's important to note that, to be clear. Make the point directly.

### "It's not X — it's Y"

Max one per piece, and only if it serves the argument. Rewrite as a direct positive statement instead.

### Compulsive rule of three

Vary groupings. Use two items, four items, or a full sentence instead of triads. Max one "adjective, adjective, and adjective" pattern per piece.

### Missing connective tissue

Each paragraph should connect to the last. If paragraphs could be rearranged without the reader noticing, add a bridge sentence.

---

## 3. Template phrases

These slot-fill constructions signal that a sentence was generated, not written:

- "a [adjective] step towards [adjective] AI infrastructure" → describe the specific capability or outcome
- "a [adjective] step forward for [noun]" → say what actually changed
- "Whether you're [X] or [Y]" → false-breadth construction. Pick the audience you're actually writing for, or cut
- "I recently had the pleasure of [verb]-ing" → say what happened: "I talked to," "I read," "I attended"
- "In today's [X]" / "In an era where" → cut or state specific context
- "When it comes to" → just talk about the thing directly

---

## 4. Transition phrases

Remove or rewrite these:

- "Moreover" / "Furthermore" / "Additionally" → restructure so the connection is obvious, or use "and," "also," "on top of that"
- "It's worth noting that" / "Notably" → just state the fact
- "Here's what's interesting" / "Here's what caught my eye" → let the content signal its own importance. If you need a lead-in, make it specific: "The revenue number matters because..."
- "In conclusion" / "In summary" / "To summarise" → your conclusion should be obvious without the label
- "At the end of the day" → cut
- "That said" / "That being said" → cut or use "but," "yet," or "however" — don't overuse any one of them

---

## 5. Structural issues

### Uniform paragraph length

If every paragraph is roughly the same size, vary deliberately. Some paragraphs should be one sentence. Some longer.

### Formulaic openings

If the piece opens with broad context before the point ("In the rapidly evolving world of..."), rewrite to lead with the news or the insight. Context can come second.

### Copula avoidance

AI avoids "is" and "has" by substituting fancier verbs: "serves as," "features," "boasts," "presents," "represents." These read like a press release. Default to "is" or "has" unless a more specific verb adds real meaning.

### Synonym cycling

AI rotates synonyms to avoid repeating a word: "developers… engineers… practitioners… builders" in the same paragraph. Human writers repeat the clearest word. If the same noun appears three times and that's the right word, keep all three.

### Vague attributions

"Experts believe," "Studies show," "Research suggests" without naming the expert, study, or source. Either cite a specific source or drop the attribution and state the claim directly.

### Significance inflation

"Marking a pivotal moment in the evolution of..." or "a watershed moment for the industry" inflate routine events. State what happened. Let the reader judge significance.

### False ranges

AI creates false breadth by pairing unrelated extremes: "from the Big Bang to dark matter," "from ancient civilisations to modern startups." These sound sweeping but say nothing. List the actual topics or pick the one that matters.

---

## 6. Chatbot artefacts

Remove entirely from published prose:

- "I hope this helps!", "Certainly!", "Absolutely!", "Great question!", "Feel free to reach out", "Let me know if you need anything else"
- "In this article, we will explore…" or "Let's dive in!" → cut or rewrite with a direct opening
- "Let's explore," "Let's take a look," "Let's break this down" → any "let's + verb" functioning as a transition rather than a genuine invitation. Start with the point instead
- "Let me think step by step," "Breaking this down," "To approach this systematically," "Step 1:" → chain-of-thought reasoning leaking into prose. State the conclusion, then the evidence
- Acknowledgement loops: "You're asking about," "To answer your question," "That's a great question. The..." → just answer
- Sycophantic openers: "Great question!", "Excellent point!", "You're absolutely right!" → remove entirely

---

## 7. Severity tiers

Use these to prioritise fixes when time is limited.

### P0 — credibility killers (fix immediately)

- Cutoff disclaimers: "As of my last update," "I don't have access to real-time data"
- Chatbot artefacts: "I hope this helps!", "Great question!"
- Vague attributions without named sources: "Experts believe"
- Significance inflation on routine events: "a watershed moment for the industry"

### P1 — obvious AI smell (fix before publishing)

- Tier 1 word violations (delve, leverage, robust, seamless, etc.)
- Template phrases and slot-fill constructions
- "Let's" transition openers
- Formulaic openings ("In the rapidly evolving world of...")
- Bold overuse
- Em dash frequency above 1 per 1,000 words

### P2 — stylistic polish (fix when time allows)

- Generic conclusions ("The future looks bright", "Only time will tell")
- Compulsive rule of three
- Uniform paragraph length
- Copula avoidance (serves as, features, boasts)
- Overused transition phrases (Moreover, Furthermore, Additionally)
- Tier 2 word clusters in the same paragraph

**Quick triage rule:** For a fast pass, fix P0 and P1 only. A clean P0+P1 pass is publishable. P2 is polish.
