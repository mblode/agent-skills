# No AI prose

Copied from the copywriting skill, then cut to what applies to assistant replies. Marketing-only tells (significance inflation, false ranges, "the brand", publishable P0/P1) stay with `copywriting`.

## Contents

- [Tier 1: always replace](#tier-1-always-replace)
- [Tier 2: flag when 2+ appear in the same paragraph](#tier-2-flag-when-2-appear-in-the-same-paragraph)
- [Tier 3: flag only at high density](#tier-3-flag-only-at-high-density)
- [Patterns](#patterns)

The never-write set and the em dash rule live in SKILL.md. This file is the longer lists plus the tells a word pass misses. For assistant replies this skill's voice wins: a brand or personal voice file does not keep a listed word.

Numbered steps the reader will run are not a chatbot "Step 1:" leak. A five-item action list is list-like content, not a bullet-prose tell.

---

## Tier 1: always replace

5-20x more common in AI text than human writing. Replace on sight.

| Word / phrase | Replace with |
|---------------|--------------|
| delve / delve into | look at, dig into |
| landscape (metaphor) | field, space, industry, world |
| tapestry | (describe the actual complexity) |
| realm | area, field, domain |
| paradigm | model, approach, framework |
| embark | start, begin |
| beacon | (rewrite entirely) |
| testament to | shows, proves, demonstrates |
| robust | strong, reliable, solid |
| comprehensive | thorough, complete, full |
| cutting-edge | latest, newest, advanced |
| leverage (verb) | use |
| pivotal | important, key, critical |
| underscores | highlights, shows |
| meticulous / meticulously | careful, detailed, precise |
| seamless / seamlessly | smooth, without friction |
| game-changer / game-changing | describe what changed and why |
| utilise | use |
| nestled | is located, sits, is in |
| vibrant | (describe what makes it active, or cut) |
| deep dive / dive into | look at, examine |
| unpack / unpacking | explain, break down, walk through |
| showcase | show, demonstrate (or name what it shows) |
| unlock | enable, give access to, let (or name what becomes possible) |
| intricate / intricacies | complex, detailed (or name the specific complexity) |
| holistic / holistically | complete, full, whole |
| actionable | practical, useful, concrete |
| impactful | effective, significant (or describe the impact) |
| learnings | lessons, findings, takeaways |
| thought leadership | expertise (or describe the contribution) |
| best practices | what works, proven methods |
| synergy / synergies | (describe the combined effect) |
| in order to | to |
| due to the fact that | because |
| serve as | is |
| commence | start, begin |
| keen (as intensifier) | interested, eager (or cut) |

---

## Tier 2: flag when 2+ appear in the same paragraph

One is fine; two or more signals a pattern.

| Word / phrase | Replace with |
|---------------|--------------|
| harness | use, take advantage of |
| navigate / navigating | work through, handle, deal with |
| foster | encourage, support, build |
| elevate | improve, raise, strengthen |
| unleash | release, enable, open up |
| streamline | speed up |
| empower | enable, let, allow |
| bolster | support, strengthen |
| spearhead | lead, drive, run |
| resonate / resonates with | connect with, appeal to, matter to |
| revolutionise | change, transform, reshape |
| facilitate | enable, help, allow |
| underpin | support, form the basis of |
| nuanced | specific, subtle, detailed (or name the actual nuance) |
| crucial | important, key, necessary |
| ecosystem (metaphor) | system, community, network, market |
| myriad | many, numerous (or give a number) |
| plethora | many, a lot of (or give a number) |
| catalyse | start, trigger, accelerate |
| transformative | (describe what changed and how) |
| cornerstone | foundation, basis, key part |
| paramount | most important, top priority |
| burgeoning | growing, emerging |
| nascent | new, early-stage, emerging |
| overarching | main, central, broad |

---

## Tier 3: flag only at high density

Fine in moderation. Flag only at roughly 3%+ density.

| Word | Fix |
|------|-----|
| significant / significantly | use specifics: numbers, comparisons, examples |
| innovative / innovation | describe what's new |
| effective / effectively | say how, or cite a metric |
| dynamic / dynamics | name the forces or changes |
| compelling | say why it compels |
| unprecedented | name the precedent it breaks (or cut) |
| exceptional / exceptionally | cite what makes it an exception |
| remarkable / remarkably | say what's worth remarking on |
| sophisticated | describe the sophistication |
| world-class / state-of-the-art | cite a benchmark or comparison |

---

## Patterns

### Formatting

Strip bold from most phrases. Max one bolded phrase per major section, ideally none. If something is important enough to bold, lead with it instead.

A bold label takes a colon, not a period: `**Cause:**`, never `**Cause.**`.

### Sentence tells

Cut hollow intensifiers: genuinely, truly, quite frankly, to be honest, let's be clear, it's worth noting that, real (as in "a real improvement").

Cut hedges that add no uncertainty: perhaps, could potentially, it's important to note that, to be clear. Keep a hedge that is real.

Cut announced honesty ("honestly", "I'll be straight with you") and emotional flatline ("what struck me was", "it's fascinating that"). State the thing.

Default to "is" or "has". Skip "serves as," "features," "boasts," "presents," "represents" unless the verb adds meaning.

Repeat the clearest noun. Do not rotate "developers… engineers… practitioners… builders" in one paragraph.

### Template phrases and transitions

Rewrite or cut:

- "Whether you're [X] or [Y]"
- "In today's [X]" / "In an era where" / "When it comes to"
- "Moreover" / "Furthermore" / "Additionally"
- "Here's what's interesting" / "Here's the thing" / "The kicker?"
- "In conclusion" / "In summary" / "At the end of the day" / "That said"

Open with the point, not a tee-up or a rhetorical question the reader did not ask.

### Chatbot artefacts

Remove entirely:

- "I hope this helps!", "Certainly!", "Absolutely!", "Great question!", "Feel free to reach out", "Let me know if you need anything else"
- "Let's dive in!", "Let's explore," "Let's take a look," "Let's break this down"
- "Let me think step by step," "Breaking this down," "To approach this systematically"
- "You're asking about," "To answer your question," "That's a great question. The..."
- "Excellent point!", "You're absolutely right!"

### Drafting tells

These survive a word-level pass.

**Prompt echo.** The reply hands the user's own phrasing back as the explanation. Asked "why the session cookie is ignored", it opens "The session cookie is ignored because...". Take the facts, throw away the wording.

**Generic default over the supplied specific.** The user named `src/auth.ts:42` or `jsonwebtoken`; the reply says "the auth file" or "a library". Every specific they supplied appears, or it was cut for a stated reason.

**Uniform confidence.** Every line lands at the same pitch, usually mid-enthusiasm. Real talk has a flat line next to a strong one.
