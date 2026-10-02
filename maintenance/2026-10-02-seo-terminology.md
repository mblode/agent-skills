# Define SEO, AEO and GEO in seo

Date: 2026-10-02
Baseline: 6834bed

## Decision

- The skill said "SEO/AEO" in its description, used "answer engines" for every AI surface (ChatGPT, Claude, Perplexity and AI Overviews alike), and its evals spoke of a "GEO budget", without defining any of the three.
- `answer-engines.md` now opens with a Terms table: SEO (classic search), AEO (AI answers inside a search engine: AI Overviews, AI Mode, Copilot answers), GEO (standalone assistants: ChatGPT search, Claude, Perplexity, Gemini app), each with its engines, retrieval source and native measurement. "AI search" is the umbrella for AEO and GEO. It says the labels are not standardized and that the two share SEO's foundations, so they are not separate retainers or one blended score.
- GEO's origin (Aggarwal et al., KDD 2024, arXiv 2311.09735) is in `sources.md`, scoped to the definition.
- Description, IS line, audit row, research protocol, sources and README use the same terms. The filename stays `answer-engines.md` because `agent-ready` links to it.
- One routing prompt added: the SEO versus AEO versus GEO question.
