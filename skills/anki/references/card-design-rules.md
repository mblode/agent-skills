# Card Design Rules

## Contents

- [Core principles](#core-principles)
- [Minimum information principle](#minimum-information-principle)
- [8-second rule](#8-second-rule)
- [Bidirectional cards](#bidirectional-cards)
- [Card construction patterns](#card-construction-patterns)
- [Cloze-specific rules](#cloze-specific-rules)
- [Anti-patterns](#anti-patterns)
- [Progressive difficulty](#progressive-difficulty)

## Core principles

Every card must be:

- **Atomic** — Tests exactly one fact. One card, one recall target.
- **Source-grounded** — Traces directly to the provided source material. Never generate from general knowledge.
- **Recall-oriented** — Requires active retrieval, not passive recognition. The learner must produce the answer, not just recognize it.
- **Useful** — Tests meaningful knowledge the learner will actually need. Skip trivial facts, obvious definitions, and filler.

## Minimum information principle

One card = one fact. If you can split a card into two independent questions, you must.

**Bad — tests a set:**

```
Q: What are the four HTTP request methods used in REST APIs?
A: GET, POST, PUT, DELETE
```

**Good — one card per item:**

```
Q: Which HTTP method is used to retrieve a resource without modifying it?
A: <b>GET</b>
```

The exception: when the set itself is the atomic fact (e.g., a formula with named variables). In that case, use cloze deletion to test each variable individually.

## 8-second rule

A learner who knows the material should produce the answer in under 8 seconds. If the answer requires more than 2-3 sentences of recall, the card is too big. Break it down or convert to cloze.

Signs a card violates this rule:
- Answer is longer than 3 sentences
- Learner needs to mentally enumerate items
- Answer requires chaining multiple reasoning steps

## Bidirectional cards

Create reversed pairs for:
- **Terminology** — Term → Definition AND Definition → Term
- **Translations** — Source language → Target language AND back
- **Concept ↔ Example** — Concept → Concrete example AND Example → Concept name

Generate as two separate Basic cards. Tag both with the `reversed` modifier.

**Do NOT reverse:**
- Explanatory cards ("Why does X matter?")
- Reasoning cards ("How does X work?")
- Comparison cards ("How does X differ from Y?")
- Application cards ("When would you use X?")

Reversing these produces vague, unanswerable prompts.

**Example — good bidirectional pair:**

```
Forward: What is the term for a function passed as an argument to another function?
Back: <b>Callback</b>

Backward: What does a callback do?
Back: A function <b>passed as an argument</b> to another function, invoked after an operation completes
```

## Card construction patterns

| Pattern | Front template | Back template |
|---------|---------------|---------------|
| Definition | "What is X?" / "What does X mean?" | "X is `<b>`key definition`</b>`" |
| Comparison | "How does X differ from Y?" | "X does `<b>`A`</b>` while Y does `<b>`B`</b>`" |
| Application | "When would you use X instead of Y?" | "Use X when `<b>`condition`</b>`" |
| Cause-effect | "Why does X lead to Y?" | "Because `<b>`mechanism/reason`</b>`" |
| Context cue | Prefix with topic area when ambiguous: "In [domain], what does..." | Same rules apply |

**Bold highlighting:**
- Always bold the exact phrase the learner must recall
- Bold 1-3 key phrases per answer, not entire sentences
- Use `<b>bold</b>` HTML tags (not Markdown)

**HTML rules:**
- `<b>` for bold key terms
- `<br>` for line breaks within a field
- No other HTML tags (`<i>`, `<ul>`, `<p>`, etc.)

## Cloze-specific rules

Use cloze deletion for:
- **Port numbers** — `SSH runs on port {{c1::22}}`
- **Specific values** — `TCP/IP has {{c1::4}} layers`
- **Command syntax** — `To stage all changes: {{c1::git add .}}`
- **Formulas** — `BMI = {{c1::weight (kg)}} / {{c2::height (m)}}²`
- **Numeric benchmarks** — `HTTP status {{c1::404}} means resource not found`

Rules:
- Multiple deletions (c1, c2, c3...) are fine when values belong to one coherent fact
- Each deletion generates a separate review card in Anki
- Never blank more than 30% of the text — the surrounding context must provide enough cue
- The blank must have exactly one correct answer. If multiple answers could fit, cloze is the wrong format.
- Keep the surrounding sentence specific enough to prime recall

**Bad cloze — too much blanked:**

```
The {{c1::___}} enzyme catalyzes the conversion of {{c2::___}} to {{c3::___}}
```

**Good cloze — enough context remains:**

```
BMI = {{c1::weight (kg)}} / {{c2::height (m)}}²
```

## Anti-patterns

| Anti-pattern | Problem | Fix |
|-------------|---------|-----|
| Kiddie card | Trivially easy, zero learning value | Skip it entirely — not everything deserves a card |
| Midterm essay | Answer is 5+ sentences, takes 30s+ to recall | Split into 2-3 atomic cards |
| Shopping list | "List the 7 types of..." tests rote sequence | One card per item, or use overlapping cloze |
| Yes/no question | Binary answer, tests recognition not recall | Reframe: "Is X a debt?" → "How is X classified?" |
| Life hack card | Generic advice, not testable knowledge | Only create cards for testable, specific facts |
| Vague prompt | "Tell me about DNS" — no specific recall target | Ask a precise question with one expected answer |
| Trivial fact | Tests something obvious or self-evident | Focus on knowledge that requires effort to retain |
| Overly long answer | Buries the key point in paragraphs | Trim to 1-3 sentences with bold on the key phrase |
| Example trap | "Give an example of X" — which example? | Pin down the specific example: "What is X's example of Y?" |

## Progressive difficulty

Cards exist on a spectrum from recognition (easier) to free recall (harder):

1. **Recognition** — Multiple choice, true/false (avoid in Anki — too easy)
2. **Cued recall** — Cloze deletion with rich surrounding context (moderate)
3. **Free recall** — Open-ended question with minimal cues (hardest, most effective)

The target is "recalled with effort" — slightly challenging but achievable. If trivially easy every time, the card wastes review time. If impossibly hard, it builds frustration.

Easy cards lean toward cued recall. Hard cards lean toward free recall. Medium cards mix both.
