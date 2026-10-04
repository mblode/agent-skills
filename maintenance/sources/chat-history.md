# chat-history sources

Provenance and install notes for `skills/chat-history`, moved out of the retired `references/hosts.md`. Never loads during a task.

## Installation

```bash
npx skills add mblode/agent-skills -g --skill chat-history --agent codex cursor claude-code -y
```

Before a change is published, substitute the absolute local repository path for `mblode/agent-skills`. Installation uses `~/.agents/skills/chat-history` for Codex and Cursor, with a Claude Code entry at `~/.claude/skills/chat-history`.

The locally inspected Grok Build documentation lists both `~/.grok/skills` and `~/.claude/skills` as user skill locations, deduplicated by name, so the Claude entry is enough for Grok discovery. Where an explicit Grok entry is useful, link the canonical installed directory into `~/.grok/skills/chat-history` after checking the destination is absent; preserve an existing installation. Do not invent a skills-installer agent identifier for Grok.

This layout was checked against the local installer and Grok documentation. Other host versions may differ; inspect the host's documented skill paths if discovery fails, and refresh skill discovery in a running agent.

## Install verification

Check the loaded skill directory contains SKILL.md, references, and scripts, and compare all installed files with the source. From an unrelated working directory, run the installed script's `discover` and `--help`. Use a synthetic transcript for a search/read smoke test without a model request or account credentials.

Grok Build exposes `grok inspect --json` to inspect discovered configuration without starting a model conversation; check its skill inventory contains `chat-history`. That establishes loader discovery, not end-to-end model behaviour, and the same holds for filesystem checks on other hosts.
