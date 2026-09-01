# Format Specification

What the format requires that a script cannot teach you. Every mechanical limit (name and description constraints, body length, TOC thresholds, kebab-case, orphan and chain detection) is enforced by `scripts/validate.sh` and deliberately not restated here.

## Contents

- Directory Structure
- Two Frontmatter Vocabularies
- Spec Fields (portable)
- Claude Code Fields
- Substitutions in the Body
- Loading Semantics
- Naming

## Directory Structure

```
skills/<name>/
├── SKILL.md              (required; frontmatter must start on line 1)
├── references/           (progressive disclosure, loaded on demand)
├── rules/                (audit and lint skills)
│   ├── _sections.md      (category map: prefix, impact, description)
│   ├── _template.md      (per-rule schema)
│   └── <prefix>-<slug>.md
├── scripts/              (executable utilities)
├── assets/               (templates the skill copies into output)
├── agents/               (subagent prompts the skill dispatches)
├── evals/evals.json      (test prompts; never loads during a user task)
├── config.json           (user-specific setup captured once)
└── <track>.md            (simple/hub pattern only)
```

Root-level `<track>.md` files belong to the simple/hub pattern; every other pattern keeps supporting files in `references/` or a rules folder. Multiple rules folders (`rules-arch/` plus `rules-ax/`) are legal only when SKILL.md dispatches to each layer explicitly, as `ax-audit` does.

## Two Frontmatter Vocabularies

The open spec defines six fields. Claude Code accepts those six plus a dozen of its own. The distinction matters because the two paths fail differently:

- **Claude Code** (personal, project, plugin, enterprise skills) accepts every field below and ignores the spec-only ones it does not act on.
- **claude.ai uploads, the Skills API, Cowork and cloud sessions, and `package_skill.py`** accept only the six spec fields. Any other key is a hard error, not a warning: `Unexpected key(s) in SKILL.md frontmatter: argument-hint`.

So a skill meant to travel stays within the spec six. A skill that needs a Claude Code field is Claude Code-only, and the description or `compatibility` should say so. Claude Code-only body features (dynamic `!` injection, `$ARGUMENTS`) do not run outside Claude Code either.

## Spec Fields (portable)

`name` and `description` are required. The rest are optional and rarely needed:

| Field | Limit | Use |
|-------|-------|-----|
| `license` | none | License name, or the name of a bundled LICENSE file |
| `compatibility` | 500 chars | Environment requirements: intended product, system packages, network. Most skills omit it |
| `metadata` | string-to-string map | Custom properties for your own tooling; pick distinctive key names |
| `allowed-tools` | space-separated string | Tools pre-approved to run while the skill is active. Experimental in the spec; Claude Code implements it as a permission grant for the invoking turn only |

`allowed-tools` grants, it does not restrict: every other tool stays callable under normal permission rules, and the grant clears on the next user message. To remove tools, use Claude Code's `disallowed-tools`.

## Claude Code Fields

Optional, Claude Code-only, and the ones worth knowing:

| Field | Use |
|-------|-----|
| `disable-model-invocation: true` | Only a person can start it (`/name`). The description leaves the listing entirely, it is not preloaded into subagents, and scheduled tasks cannot fire it. For side effects and timing: deploys, sends, spend, control-plane actions |
| `user-invocable: false` | Only the model can start it; hidden from the `/` menu. For background knowledge that is not an action |
| `context: fork` | Body runs as a subagent prompt with no conversation history; `agent:` picks the subagent type (`Explore`, `Plan`, `general-purpose`, or a custom one), `background: false` waits for the result. Only for bodies that are a task; guidelines forked this way return nothing useful |
| `paths` | Glob list; the skill auto-loads only when Claude is working in matching files |
| `hooks` | Hooks registered when the skill is invoked and kept for the rest of the session; `once: true` removes one after its first successful run. Any hook event |
| `model`, `effort` | Override for the invoking turn only; the session setting resumes on the next prompt |
| `disallowed-tools` | Tools removed while the skill is active (an autonomous loop that must never call `AskUserQuestion`) |
| `argument-hint`, `arguments` | Autocomplete hint, and named positional arguments for `$name` substitution |
| `when_to_use` | Extra trigger text appended to the description in the listing; shares the description's cap |

`disable-model-invocation` is the one most skills should consider. Claude Code blocks the model's call and tells it not to reproduce the steps another way, so in Claude Code the field alone is enough. Other harnesses only read it as a hint, so a skill that travels also states in its body who may start it and what to do otherwise.

## Substitutions in the Body

Claude Code replaces these before the model sees the content:

- `$ARGUMENTS`, `$0`, `$1`, `$name`: what the user typed after `/name`. An unfilled indexed placeholder stays literal; an unfilled named one becomes empty. Escape a literal with `\$1`.
- `${CLAUDE_SKILL_DIR}`: the folder holding this SKILL.md. Use it for every `scripts/` path so the command resolves after the session shell has `cd`'d elsewhere. It is also substituted inside `allowed-tools` Bash rules.
- `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_SESSION_ID}`, `${CLAUDE_EFFORT}`: project root, session id, active effort level.
- `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`: substituted in plugin skills only. In a personal or project skill they stay literal text, which is why a durable-storage path must not depend on them there.
- `` !`command` `` (inline) or a ```` ```! ```` fenced block: runs the shell command and inlines its output. Mechanics and failure modes are in `executable-code.md`.

## Loading Semantics

These govern what Claude can see, so they drive structure decisions:

- At session start only the listing loads: every skill's name, and as much of each description as fits a budget of about 1% of the context window (each entry capped at 1,536 characters). Over budget, Claude Code trims descriptions starting with the least-invoked skills. Put the key use case first; the tail is what gets cut. `/doctor` reports the listing's cost and biggest contributors.
- Frontmatter counts only when the opening `---` is line 1. Malformed YAML loads the body with empty metadata: `/name` still works, so the breakage is invisible until you notice the skill never auto-triggers. `claude plugin validate <skills-dir>` finds these.
- SKILL.md is read once when invoked and stays in context as a single message; it is not re-read on later turns. Write standing instructions, not one-time steps.
- After auto-compaction each invoked skill is re-attached with only its first 5,000 tokens, sharing a 25,000-token pool from most recent backwards. The load-bearing content belongs at the top of the body.
- A file not linked from SKILL.md is never discovered. Unlinked is invisible, not merely undocumented.
- References are one level deep. A reference that tells you to load another reference breaks the flat loading graph and invites `head -100` partial reads.
- Bundled files cost nothing until read, so a comprehensive reference folder is cheap; a bloated SKILL.md is not.
- Long references are fine up to roughly 450 lines when single-topic and TOC'd. Split by loading condition, not line count: two topics read at different moments belong in two files even at 60 lines each.
- Claude Code watches `~/.claude/skills/` and `.claude/skills/` and picks up SKILL.md text changes within the session; a symlinked folder counts. A copied install does not follow the repo.

## Naming

Name for the specific capability. Gerund form (`processing-pdfs`) is the documented default; noun-phrase (`pdf-processing`) and action-oriented (`process-pdfs`) are both acceptable and both used in this repo. Avoid `helper`, `utils`, `tools`, `documents`, `data`: they give the model nothing to route on. In Claude Code the `/command` comes from the directory name and `name` is the display label, which is one more reason the spec requires them to match.
