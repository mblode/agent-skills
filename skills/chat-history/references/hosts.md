# Host setup

## Shared execution contract

Codex, Grok Build, Cursor Agent, and Claude Code can execute the same Python script using their own shell tool. Resolve the script from the loaded SKILL.md directory; do not assume the working directory or a vendor-specific environment variable. Python 3.9+, standard-library SQLite, ripgrep, and readable history files are the runtime prerequisites.

The invoking model and the stored transcript format are independent. A Grok model in Cursor uses Cursor's skill loading and tools. Grok Build uses its own loader. A browser-only chatbot without filesystem or shell access cannot execute this skill; a cloud agent needs the source files mounted or supplied locally. The skill does not retrieve Grok web chats or Grok Bot cloud conversations through an account API.

## Installation

For this repository's source, the skills installer supports:

```bash
npx skills add mblode/agent-skills -g --skill chat-history --agent codex cursor claude-code -y
```

Before the change is published, substitute the absolute local repository path for `mblode/agent-skills`. Installation uses `~/.agents/skills/chat-history` for Codex and Cursor, with a Claude Code entry at `~/.claude/skills/chat-history`.

The locally inspected Grok Build documentation lists both `~/.grok/skills` and `~/.claude/skills` as supported user skill locations, deduplicated by name. The Claude entry is sufficient for Grok discovery. Where an explicit Grok entry is useful, link the canonical installed directory into `~/.grok/skills/chat-history` after checking the destination is absent; preserve an existing installation. Do not invent a skills-installer agent identifier for Grok.

This installation layout was checked against the local installer and Grok documentation. Other host versions may differ; inspect the host's current documented skill paths if discovery fails. Restart or refresh skill discovery in an already running agent if needed.

## Verification

Check the loaded skill directory contains SKILL.md, references, and scripts, and compare all installed files with the source. From an unrelated working directory, execute the installed script's `discover` and `--help`. Use a synthetic transcript for a search/read smoke test without needing a model request or account credentials.

Grok Build exposes `grok inspect --json` to inspect discovered configuration without starting a model conversation. Check that its skill inventory contains `chat-history`. This establishes loader discovery, not an end-to-end model behavior test. The same distinction applies to filesystem installation checks for other hosts.
