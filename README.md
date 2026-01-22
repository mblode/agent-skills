# Agent Skills

A minimal, opinionated set of skills for planning, design, engineering, and UI quality.

## Quick Start

```bash
npx skills add mblode/agent-skills
```

Supports OpenCode, Claude Code, Codex, and Cursor.

## Lifecycle Chooser

- Plan (before coding): `plan-feature` for a full implementation plan/spec.
- Architecture setup (project start): `define-architecture` for repo shape, backend patterns, and workflow.
- Visual direction (design phase): `design-ui` for product vs marketing look/feel.
- Implementation (build phase): `implement-frontend` for React/TypeScript/Next standards.
- UI QA (pre‑ship): `audit-ui` for typography, accessibility, and final craft pass.
- Motion/animation: `ui-animation` for easing, timing, and reduced-motion rules.
- Review (pre‑merge): `review-pr` for bug and CLAUDE.md compliance checks.
- Launch/SEO (pre‑launch and audits): `optimise-seo` for metadata, structure, and Core Web Vitals.

## Skills Included

### plan-feature

Create detailed implementation plans and specifications before coding. Use when you need a full technical spec with step-by-step implementation details.

### define-architecture

Set up repository structure, backend patterns, and development workflow. Use at project start or when establishing conventions for full-stack TypeScript applications.

### design-ui

Define visual direction and design system for web interfaces. Choose between product (SaaS/admin/data-heavy) or marketing/brand experiences with appropriate layout, typography, and color systems.

### implement-frontend

Implementation standards and best practices for React/TypeScript/Next.js. Use when writing or reviewing frontend code, especially forms, state management, hooks/components, and type safety.

### audit-ui

Final quality audit for typography, accessibility, and UX polish. Use when reviewing or refining UI before release to ensure professional craft and compliance.

### ui-animation

Guidelines and examples for UI motion and animation. Use when designing, implementing, or reviewing motion, easing, timing, and reduced-motion behaviour.

### review-pr

High-signal pull request review focused on bugs and CLAUDE.md compliance. Use before creating PRs or when reviewing changes to catch issues early.

### optimise-seo

Optimize SEO for Next.js applications including sitemaps, meta tags, structured data, and Core Web Vitals. Use for pre-launch audits and ongoing SEO improvements.

### multi-tenant-platform-architecture

Cloudflare-first architecture guidance for multi-tenant platforms where tenants own their space. Use for domain strategy, isolation, routing, custom domains, and plan/limit mapping.

## Contributing

Edit the files in `skills/`. Keep `SKILL.md` concise and use reference files for detail.
