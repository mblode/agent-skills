<div align="center">

# Agent Skills

**Nobody ships AI slop on purpose. These skills make sure you don’t.**

Taste, brakes, and backlog control for coding agents. Fifteen skills that hold what the model cannot know: your design system, your voice, your gates, and the failures you have already paid for.

<p align="center">
  <a href="https://www.skills.sh/mblode/agent-skills">
    <img src="https://img.shields.io/endpoint?url=https%3A%2F%2Fwww.skills.sh%2Fapi%2Fbadge%2Fmblode%2Fagent-skills&label=installs" />
  </a>
  <a href="https://github.com/mblode/agent-skills/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/mblode/agent-skills?style=flat&colorA=000000&colorB=000000" />
  </a>
</p>

</div>

## Install

```bash
npx skills add mblode/agent-skills -g --agent codex claude-code -y
```

If these help, [star the repo](https://github.com/mblode/agent-skills) so others find them.

Agents: these skills. Humans: [Taste Training](https://blode.co/taste-training), a course on spotting and fixing AI slop. First unit free.

## Skills

### Build

- **[architecture](./skills/architecture/SKILL.md)**: Module contracts, from-scratch rebuilds with a walking skeleton and a pass/fail production gate, and multi-tenant isolation, routing, and custom domains.
- **[backlog](./skills/backlog/SKILL.md)**: Runs a large backlog through parallel agents: review-sized tickets, WIP capped at review capacity, a ledger, stall and budget rules, model lanes, and a weekly retro.
- **[gates](./skills/gates/SKILL.md)**: The brakes: hooks, required CI checks, PR size limits, checks that the checks can fail, measured CI speedups, and one AGENTS.md every agent reads.
- **[scaffold](./skills/scaffold/SKILL.md)**: New repos from house templates (Next.js Turborepo, TypeScript CLI, SaaS monorepo), proven on a cold clone.

### Ship

- **[tidy](./skills/tidy/SKILL.md)**: Diff or PR review with file:line findings in confirmed and plausible tiers (bugs, structure, AI slop, security), report-only by default; apply mode lands the fixes and simplifies the diff.
- **[ship](./skills/ship/SKILL.md)**: PRs with a Risk and Proof section, changesets npm releases with OIDC publish, and review-thread accounting through to merge-ready.

### Design

- **[design](./skills/design/SKILL.md)**: Product behaviour with stable rule IDs, visual direction and Tailwind builds, a UX and typography audit with a ship verdict, browser probes that measure each finding, and motion fitted from recordings.
- **[presentation-creator](./skills/presentation-creator/SKILL.md)**: Decks with a story spine, speaker notes, and a contrast-checked QA pass, as Marp markdown, a web app, or a handoff to pptx.

### Writing

- **[ghostwriter](./skills/ghostwriter/SKILL.md)**: Writes anything as you or as your company: messages, posts, tickets, PRDs, design docs, slides, copy, docs, READMEs, and plain-language explanations. Works with no profile and writes one from pasted samples.

### Audits

- **[seo](./skills/seo/SKILL.md)**: SEO/AEO audits and fixes, search-demand research, writer briefs, and search, AI visibility, and conversion measurement.
- **[agent-ready](./skills/agent-ready/SKILL.md)**: Implements AFDocs, Is Agentic, Is It Agent Ready, and agent 404 findings: llms.txt maps, markdown twins, API errors.
- **[ax-audit](./skills/ax-audit/SKILL.md)**: Agentic experience audit: 27 rules for tool parity, approval gates, and escape hatches, ship verdict.
- **[dx-audit](./skills/dx-audit/SKILL.md)**: Libraries, CLIs, SDKs, npm packages: 38 rules, agent-friendly checks, root-cause findings.

### Authoring

- **[agent-skills-creator](./skills/agent-skills-creator/SKILL.md)**: Creates and audits skills by their added value, prefers a check over a rule, with a validator and regression scenarios.
- **[chat-history](./skills/chat-history/SKILL.md)**: Recover decisions, previous fixes, and context from past AI conversations with fast local search and source evidence.

## License

MIT

---

Crafted by [<img src="https://blode.co/avatar-circle.png" width="20" align="top" />](https://blode.co) [Matthew Blode](https://blode.co)
