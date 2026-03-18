---
name: blog-post
description: Generates engaging blog posts from source materials or topic briefs. Supports listicles, tutorials, how-to guides, narrative essays, and thought leadership. Handles research, outlining, drafting, SEO optimization, and polishing. Use when writing a blog post, creating a listicle, turning research into an article, writing a tutorial, or asking "write a blog post about this."
---

# Blog Post

Research, draft, and polish publication-ready blog posts.

## Workflow

```text
Blog post progress:
- [ ] Step 1: Clarify topic and format
- [ ] Step 2: Research and gather sources
- [ ] Step 3: Extract key insights and outline
- [ ] Step 4: Write the post
- [ ] Step 5: SEO and polish
- [ ] Step 6: Validate quality
```

### Step 1: Clarify topic and format

Determine the post type before writing. Ask the user if unclear:

| Format | Best for | Structure |
|--------|----------|-----------|
| **Listicle** | Surprising takeaways from sources | Numbered insights with analysis |
| **Tutorial / how-to** | Teaching a process step by step | Problem → steps → result |
| **Narrative** | Personal experience or journey | Story arc with tension and resolution |
| **Thought leadership** | Industry commentary or opinion | Thesis → evidence → implications |

### Step 2: Research and gather sources

Read files, fetch URLs, or accept pasted text. If the user provides a topic without sources, research the topic before writing. Read every source completely before outlining.

Accept messy input — scattered thoughts, bullet points, brain dumps, random observations. The mess is the input; structure is the output.

### Step 3: Extract key insights and outline

- Identify the most surprising, counter-intuitive, or impactful takeaways.
- Rank insights by reader value — lead with the strongest.
- Select 2-4 powerful quotes for blockquotes (only the best).
- Find a relatable problem or curiosity gap to anchor the introduction.
- Check for narrative potential: is there a journey from one understanding to another?

Create a section outline before drafting. Each section should have a clear purpose.

### Step 4: Write the post

Load the matching template from [references/format-templates.md](references/format-templates.md) and follow its structure. Only load the template for the chosen format — not all four.

### Step 5: SEO and polish

- **Title**: under 60 characters, include the main keyword.
- **Meta description**: 150-160 characters summarizing the post's value.
- **Keyword placement**: naturally in the title, first paragraph, and 2-4 times throughout.
- **Headers**: descriptive H2/H3 tags that work as standalone scan points.
- **Internal links**: suggest 2-3 related links if the user has other content.

### Step 6: Validate quality

```text
Before finalizing, verify:
- [ ] Hook grabs attention in the first 1-2 sentences
- [ ] Headline is specific and delivers on its promise
- [ ] Every paragraph is 2-4 sentences maximum
- [ ] Each section has analysis or insight, not just summary
- [ ] Blockquotes are limited to 2-4 total
- [ ] Conclusion looks forward with a question, CTA, or provocative takeaway
- [ ] Tone is conversational throughout — no academic language
- [ ] Title is under 60 characters with the main keyword
- [ ] Post includes a meta description (150-160 chars)
- [ ] Markdown renders correctly (headings, blockquotes, bold, code)
```

## Blog-specific voice

- Write to a smart friend, not a committee. Authenticity beats authority.
- Bold key phrases for scannability — readers skim before they read.
- Show, don't tell: specific examples with real details beat vague claims.
- Admit uncertainty when genuine. Never bluff expertise.

## Headline patterns

- **Number + insight**: "7 Things [Sources] Reveal About [Topic]"
- **Surprising tension**: "Why [Common Belief] Gets [Topic] Wrong"
- **How-to framing**: "How to [Achieve Outcome] with [Method]"
- **Question format**: "What If [Provocative Reframe]?"

Under 60 characters for SEO. Sentence case, no trailing period. Must deliver on its promise.

## Anti-patterns

- Generic headlines ("Interesting Findings About X").
- Conclusions that just summarize what was already said.
- Clickbait headlines the content does not deliver on.
- Blockquoting every source instead of choosing the 2-4 most powerful.
- Skipping research and writing from assumptions.

## Skill handoffs

| When | Run |
|------|-----|
| After blog post is written, audit prose quality | `docs-writing` |
| If post needs to become a presentation | `presentation-creator` |
| Edit and polish the copy | `copy-editing` |
| Optimize SEO beyond basics | `optimise-seo` |
