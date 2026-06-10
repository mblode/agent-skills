---
name: blog-post
description: Generates engaging long-form blog posts from source materials or a topic brief. Supports listicles, tutorials, how-to guides, narrative essays, and thought leadership. Handles research, outlining, drafting, on-page SEO, and polishing. Use when "write a blog post about this", "create a listicle", "turn this research into an article", "write a tutorial", "draft a thought leadership piece", or "write a how-to guide". For short product or marketing copy (headlines, CTAs, landing pages, onboarding strings) use copywriting; for slide decks use presentation-creator; for API references, READMEs, or how-to docs in a documentation site use docs-writing.
---

# Blog Post

- **IS:** long-form editorial articles meant to be read top to bottom: listicles, tutorials, how-to guides, narrative essays, thought leadership.
- **IS NOT:** short marketing or product copy (use `copywriting`), slide decks (use `presentation-creator`), or technical reference docs and API pages (use `docs-writing`).

## Workflow

```text
Blog post progress:
- [ ] Step 1: Lock format and angle
- [ ] Step 2: Read every source completely
- [ ] Step 3: Extract insights and outline
- [ ] Step 4: Draft from the matching template
- [ ] Step 5: On-page SEO and polish
- [ ] Step 6: Run the quality gate
```

### Step 1: Lock format and angle

Pick the format before writing a word; the format dictates the template in Step 4. If the request is ambiguous, ask one question rather than guessing.

| Format | Best for | Spine |
|--------|----------|-------|
| **Listicle** | Surprising takeaways from sources | Numbered insights, each with analysis |
| **Tutorial / how-to** | Teaching a process step by step | Problem, steps, result |
| **Narrative** | Personal experience or journey | Scene, tension, resolution |
| **Thought leadership** | Industry opinion or commentary | Thesis, evidence, implications |

Also lock the angle in one sentence: what does the reader believe or do differently after reading? A post without an angle becomes a summary, the most common failure mode.

### Step 2: Read every source completely

Read files, fetch URLs, or accept pasted text. Read each source end to end before outlining; skimming produces posts that miss the buried lede.

If the user gives a topic with no sources, research it first. Accept messy input (scattered notes, bullet dumps, half-formed observations). The mess is the input; structure is the output.

### Step 3: Extract insights and outline

- Pull the most surprising, counter-intuitive, or high-impact takeaways. Rank by reader value and lead with the strongest.
- Mark 2 to 4 quotes worth blockquoting (only the strongest), and discard the rest.
- Find the curiosity gap or concrete problem that anchors the introduction.
- Check for a narrative thread: is there a shift from one understanding to another worth tracing?

Write a section outline, one line of purpose per section, before drafting. If a section has no purpose beyond "more detail," cut it.

### Step 4: Draft from the matching template

Load only the matching format block from [references/format-templates.md](references/format-templates.md). Do not load all four. Follow its structure, then write through.

### Step 5: On-page SEO and polish

- **Title:** under 60 characters, main keyword near the front, sentence case, no trailing period.
- **Meta description:** 150 to 160 characters that sell the click, not a dry summary.
- **Keyword:** place it in the title, the first paragraph, and 2 to 4 times across the body. Do not stuff; repetition that reads unnaturally hurts more than it helps.
- **Headers:** descriptive H2/H3 that make sense when read alone in a table of contents.
- **Internal links:** suggest 2 to 3 if the user has related content; never invent URLs.

### Step 6: Run the quality gate

Walk this list and fix any failing item before declaring the post done. A post that fails any check is not finished.

```text
- [ ] Hook lands in the first 1-2 sentences
- [ ] Headline is specific, under 60 chars, and the body delivers on it
- [ ] Every paragraph is 2-4 sentences
- [ ] Each section adds analysis or insight, not just restated source
- [ ] Blockquotes total 2-4, no more
- [ ] Conclusion looks forward (question, CTA, or provocation), not a recap
- [ ] Voice is conversational throughout, no academic register
- [ ] Meta description present, 150-160 chars
- [ ] Markdown renders: headings nest, blockquotes/bold/code are well-formed
```

## Blog-specific voice

These cut against Claude's defaults, which trend toward neutral, hedged, summary prose:

- Write to one smart friend, not a committee. Authenticity beats authority.
- Bold the load-bearing phrase in a dense paragraph; readers skim before they commit.
- Show, do not tell: one concrete example with real names and numbers beats three vague claims.
- Admit genuine uncertainty instead of bluffing expertise; readers trust the seams.

## Headline patterns

- **Number + insight:** "7 Things [Source] Reveals About [Topic]"
- **Surprising tension:** "Why [Common Belief] Gets [Topic] Wrong"
- **How-to framing:** "How to [Outcome] Without [Common Obstacle]"
- **Provocative question:** "What If [Reframe of the Obvious]?"

## Gotchas

- A conclusion that restates the body teaches the reader nothing new; the close must add a forward look, a CTA, or a provocation, or readers leave with no reason to act.
- Blockquoting every source turns analysis into a clip reel; cap quotes at 2 to 4 and paraphrase the rest, or the post reads like notes.
- Writing from assumptions when sources were provided produces confident wrong claims; read every source in Step 2 before outlining.
- Keyword-stuffing to hit a count makes sentences read like spam and can trip search penalties; place the keyword where it reads naturally and stop.
- Paragraphs over four sentences kill mobile scannability where most blog traffic reads; split them.
- Clickbait the body cannot pay off (headline promises a number or result the post lacks) burns trust and raises bounce; only promise what the draft delivers.
- Inventing internal-link URLs ships dead links; only suggest links to content the user confirms exists.

## Skill handoffs

| When | Run |
|------|-----|
| Audit the finished prose against documentation/style rules | `docs-writing` |
| Turn the post into a slide deck | `presentation-creator` |
| Sharpen marketing hooks, CTAs, or strip AI writing tells | `copywriting` |
| Deepen on-page SEO beyond the basics here | `optimise-seo` |
