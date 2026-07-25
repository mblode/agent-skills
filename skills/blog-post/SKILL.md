---
name: blog-post
description: Generates engaging long-form blog posts from source materials or a topic brief. Supports listicles, editorial tutorials, how-to articles, narrative essays, and thought leadership. Handles research, outlining, drafting, on-page SEO, and polishing. Use when "write a blog post about this", "create a listicle", "turn this research into an article", "write an editorial tutorial", "draft a thought leadership piece", or "write a how-to article". For short product or marketing copy (headlines, CTAs, landing pages, onboarding strings) use copywriting; for slide decks use presentation-creator; for API references, READMEs, or how-to docs in a documentation site use docs-writing. This skill does on-page SEO for the post it writes; for sitemaps, metadata, redirects, or site-wide SEO use optimise-seo.
---

# Blog Post

- **IS:** long-form editorial articles meant to be read top to bottom: listicles, editorial tutorials, how-to articles, narrative essays, thought leadership.
- **IS NOT:** short marketing or product copy (use `copywriting`), slide decks (use `presentation-creator`), or technical documentation tutorials, how-to docs, reference docs, and API pages (use `docs-writing`).

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

Pick the format first; it dictates the Step 4 template. If ambiguous, ask one question.

| Format | Best for | Spine |
|--------|----------|-------|
| **Listicle** | Surprising takeaways from sources | Numbered insights, each with analysis |
| **Tutorial / how-to** | Teaching a process | Problem, steps, result |
| **Narrative** | Personal experience or journey | Scene, tension, resolution |
| **Thought leadership** | Industry opinion or commentary | Thesis, evidence, implications |

Lock the angle in one sentence: what does the reader believe or do differently after reading? Without one, the post is just a summary, the top failure mode.

### Step 2: Read every source completely

Read every file, URL, or pasted text end to end before outlining; skimming misses the buried lede. Accept messy input (scattered notes, bullet dumps, half-formed observations): mess in, structure out.

No sources, only a topic? Research first, then build a research packet before outlining:

| Source | URL/path | Published/updated | Credibility reason | Claims used | Conflicts/caveats | Current-sensitive? |
|---|---|---|---|---|---|---|

### Step 3: Extract insights and outline

- Pull the most surprising, counter-intuitive, or high-impact takeaways; rank by reader value and lead with the strongest.
- Mark 2 to 4 quotes worth blockquoting (only the strongest); paraphrase or discard the rest, or the post reads as a clip reel of other people's words.
- Find the curiosity gap or concrete problem that anchors the intro.
- Check for a narrative thread worth tracing: a shift from one understanding to another.

Outline one purpose line per section before drafting; cut any section whose only purpose is "more detail."

### Step 4: Draft from the matching template

Load [references/format-templates.md](references/format-templates.md): fill the shared skeleton, applying your format's row for body-section labels, extra sections, and the close. Then write through.

### Step 5: On-page SEO and polish

- **Title:** under 60 chars, keyword near front, sentence case, no trailing period.
- **Meta description:** 150 to 160 chars that sell the click, not a dry summary.
- **Keyword:** in the title, first paragraph, and 2 to 4 times across the body. Past that it reads as spam and risks a search penalty, so place them naturally and stop.
- **Headers:** descriptive H2/H3 that stand alone in a table of contents.
- **Internal links:** suggest 2 to 3 if the user has related content; never invent URLs, which ship as dead links.

### Step 6: Run the quality gate

Walk this list, then fill the Quality Report table below, which owns the numeric checks (title, meta, quote count, sources, links, facts). Fix every failing item before declaring done.

```text
- [ ] Hook lands in the first 1-2 sentences
- [ ] Headline is specific and the body delivers on its promise
- [ ] No paragraph runs past 4 sentences, and lengths vary (uniform blocks read as generated)
- [ ] Each section adds analysis or insight, not just restated source
- [ ] Conclusion looks forward (question, CTA, or provocation), not a recap
- [ ] Voice is conversational throughout, no academic register
- [ ] Markdown renders: headings nest, blockquotes/bold/code are well-formed
```

End with a compact quality report:

```markdown
## Quality Report

| Check | Result | Fix applied |
|---|---|---|
| Title length under 60 | pass/fail | |
| Meta description 150-160 | pass/fail | |
| Source count and credibility | pass/fail | |
| Quote count 2-4 | pass/fail | |
| Internal links invented? | pass/fail | |
| Current-sensitive facts checked | pass/fail/NA | |
```

## Blog-specific voice

These cut against Claude's defaults (neutral, hedged, summary prose):

- Write to one smart friend, not a committee; authenticity beats authority.
- Bold the load-bearing phrase in a dense paragraph; readers skim before committing.
- Show, don't tell: one concrete example with real names and numbers beats three vague claims.
- Admit genuine uncertainty instead of bluffing; readers trust the seams.

## Headline patterns

Pick one: number + insight ("7 Things [Source] Reveals About [Topic]"), surprising tension ("Why [Common Belief] Gets [Topic] Wrong"), how-to framing ("How to [Outcome] Without [Common Obstacle]"), or provocative question ("What If [Reframe of the Obvious]?").

## Gotchas

- A conclusion that restates the body teaches nothing; close with a forward look, CTA, or provocation.
- Drafting from assumptions when sources exist yields confident wrong claims; read every source in Step 2 first.
- Clickbait the body cannot pay off burns trust and raises bounce; promise only what the draft delivers.
- Summarising each source in turn produces a digest with no argument; the angle from Step 1 decides what gets cut.

## Skill handoffs

| When | Run |
|------|-----|
| Turn the post into a slide deck | `presentation-creator` |
| Sharpen hooks, CTAs, or strip AI writing tells | `copywriting` |
| Deepen on-page SEO beyond the basics | `optimise-seo` |

`docs-writing` is not a handoff for a finished post: it puts editorial articles out of scope, and its sentence-case, requirements-language, and bold-for-UI-elements rules contradict the blog voice above. For a sentence-level clarity pass only, load its `clarity-*` rules and `voice-no-jargon`, nothing else from that rule set.
