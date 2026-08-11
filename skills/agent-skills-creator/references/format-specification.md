# Format Specification

What the format requires that a script cannot teach you. Every mechanical limit (name and description constraints, body length, TOC thresholds, kebab-case, orphan and chain detection) is enforced by `scripts/validate.sh` and deliberately not restated here.

## Directory Structure

```
skills/<name>/
├── SKILL.md              (required)
├── references/           (progressive disclosure, loaded on demand)
├── rules/                (audit and lint skills)
│   ├── _sections.md      (category map: prefix, impact, description)
│   ├── _template.md      (per-rule schema)
│   └── <prefix>-<slug>.md
├── scripts/              (executable utilities)
├── assets/               (templates the skill copies into output)
├── agents/               (subagent prompts the skill dispatches)
├── config.json           (user-specific setup captured once)
└── <track>.md            (simple/hub pattern only)
```

Root-level `<track>.md` files belong to the simple/hub pattern; every other pattern keeps supporting files in `references/` or a rules folder. Multiple rules folders (`rules-arch/` plus `rules-ax/`) are legal only when SKILL.md dispatches to each layer explicitly, as `ax-audit` does.

## Optional Frontmatter

`name` and `description` are the only required fields. The rest are rarely needed and easy to get wrong from memory:

| Field | Limit | Use |
|-------|-------|-----|
| `license` | none | License name or a reference to a bundled LICENSE file |
| `compatibility` | 500 chars | Environment requirements; rare |
| `metadata` | none | Arbitrary key-value pairs for custom properties |

## Loading Semantics

These govern what Claude can see, so they drive structure decisions:

- Only frontmatter is pre-loaded at session start. SKILL.md is read when a trigger matches; everything else is read on demand.
- A file not linked from SKILL.md is never discovered. Unlinked is invisible, not merely undocumented.
- References are one level deep. A reference that tells you to load another reference breaks the flat loading graph.
- Bundled files cost nothing until read, so a comprehensive reference folder is cheap; a bloated SKILL.md is not.
- Long references are fine up to roughly 450 lines when single-topic and TOC'd. Split by loading condition, not line count: two topics read at different moments belong in two files even at 60 lines each.

## Naming

Name for the specific capability. Gerund form (`processing-pdfs`) is the documented default; noun-phrase (`pdf-processing`) and action-oriented (`process-pdfs`) are both acceptable and both used in this repo. Avoid `helper`, `utils`, `tools`, `documents`, `data`: they give the model nothing to route on.
